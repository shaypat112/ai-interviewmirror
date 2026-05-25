import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

function parseImprovements(value: string) {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

@Controller("api/sessions")
export class SessionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getSessions(@Query("clerkUserId") clerkUserId?: string) {
    if (!clerkUserId) {
      throw new HttpException(
        "clerkUserId is required",
        HttpStatus.BAD_REQUEST,
      );
    }

    const sessions = await this.prisma.session.findMany({
      where: { clerkUserId },
      orderBy: { createdAt: "desc" },
    });

    return sessions.map((session) => ({
      ...session,
      improvements: parseImprovements(session.improvements),
    }));
  }

  @Delete(":clerkUserId")
  async deleteSessions(@Param("clerkUserId") clerkUserId: string) {
    const result = await this.prisma.session.deleteMany({
      where: { clerkUserId },
    });

    return {
      deletedCount: result.count,
    };
  }
}
