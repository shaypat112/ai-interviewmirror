// backend/src/recordings/analyze.controller.ts
//
// This is a NEW controller just for AI analysis.
// Keep it separate from your recordings controller — different responsibility.

import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

// This is the shape of data the frontend must send us
interface AnalyzeRequestDto {
  question: string;
  transcript: string;
}

// This is the shape we always send back to the frontend
interface AnalyzeResponseDto {
  score: number;
  improvements: string[];
  exampleAnswer: string;
}

@Controller("api")
export class AnalyzeController {
  // Instantiate Gemini once when the controller is created
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

  @Post("analyze")
  async analyze(@Body() body: AnalyzeRequestDto): Promise<AnalyzeResponseDto> {
    const { question, transcript } = body;

    // Guard: don't call Gemini if we got empty data
    if (!question || !transcript) {
      throw new HttpException(
        "question and transcript are required",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // fast and cheap, good for this use case
      });

      // The prompt tells Gemini exactly what format to return.
      // We ask for JSON so we can parse it reliably on the frontend.
      // The triple-backtick JSON block at the end is the key instruction.
      const prompt = `
You are an expert technical interview coach reviewing a candidate's spoken answer.

Interview Question:
"${question}"

Candidate's Transcript:
"${transcript}"

Evaluate the answer and respond with ONLY a valid JSON object — no explanation, no markdown, no backticks. 
The JSON must match this exact shape:
{
  "score": <number from 1 to 10>,
  "improvements": [<string>, <string>, <string>],
  "exampleAnswer": "<string: 3-5 sentences of what an ideal answer sounds like>"
}

Scoring guide:
- 1-3: Missing key concepts, unclear, or very short
- 4-6: Partially correct but lacks depth or structure
- 7-8: Solid answer with minor gaps
- 9-10: Clear, complete, well-structured

Keep improvements concise and actionable (one sentence each).
The exampleAnswer should sound like a confident candidate speaking out loud.
      `.trim();

      const result = await model.generateContent(prompt);
      const raw = result.response.text();

      // Parse the JSON Gemini returns.
      // If Gemini sneaks in markdown fences despite our instructions, strip them.
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed: AnalyzeResponseDto = JSON.parse(cleaned);

      return parsed;
    } catch (err) {
      console.error("Gemini error:", err);
      throw new HttpException(
        "AI analysis failed",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}