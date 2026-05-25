import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import Groq from "groq-sdk";
import { PrismaService } from "../prisma.service";

interface AnalyzeRequestDto {
  question: string;
  transcript: string;
  clerkUserId?: string;
  category?: string;
  difficulty?: string;
}

interface AnalyzeResponseDto {
  score: number;
  improvements: string[];
  exampleAnswer: string;
}

@Controller("api")
export class AnalyzeController {
  private readonly groq = new Groq({
    apiKey: process.env.GROQ_API_KEY ?? "",
  });

  constructor(private readonly prisma: PrismaService) {}

  @Post("analyze")
  async analyze(@Body() body: AnalyzeRequestDto): Promise<AnalyzeResponseDto> {
    const { question, transcript } = body;

    if (!question || !transcript) {
      throw new HttpException(
        "question and transcript are required",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!process.env.GROQ_API_KEY) {
      throw new HttpException(
        "GROQ_API_KEY is missing from .env",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
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

      const response = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      });

      const raw = response.choices[0].message.content ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned) as AnalyzeResponseDto;

      if (body.clerkUserId) {
        await this.prisma.session.create({
          data: {
            clerkUserId: body.clerkUserId,
            question: body.question,
            transcript: body.transcript,
            score: parsed.score,
            improvements: JSON.stringify(parsed.improvements),
            exampleAnswer: parsed.exampleAnswer,
            category: body.category ?? "Unknown",
            difficulty: body.difficulty ?? "Medium",
          },
        });
      }

      return parsed;
    } catch (error) {
      console.error("Groq error:", error);
      throw new HttpException(
        "AI analysis failed",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}