import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

interface PreferencesBody {
  preferredDifficulty?: string;
  preferredCategories?: string[];
  showHints?: boolean;
  darkMode?: boolean;
}

function parseCategories(value: string) {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

@Controller("api/preferences")
export class PreferencesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(":clerkUserId")
  async getPreferences(@Param("clerkUserId") clerkUserId: string) {
    const preferences = await this.prisma.userPreferences.upsert({
      where: { clerkUserId },
      update: {},
      create: {
        clerkUserId,
      },
    });

    return {
      clerkUserId: preferences.clerkUserId,
      preferredDifficulty: preferences.preferredDifficulty,
      preferredCategories: parseCategories(preferences.preferredCategories),
      showHints: preferences.showHints,
      darkMode: preferences.darkMode,
    };
  }

  @Patch(":clerkUserId")
  async updatePreferences(
    @Param("clerkUserId") clerkUserId: string,
    @Body() body: PreferencesBody,
  ) {
    const preferences = await this.prisma.userPreferences.upsert({
      where: { clerkUserId },
      update: {
        preferredDifficulty: body.preferredDifficulty ?? "Medium",
        preferredCategories: JSON.stringify(body.preferredCategories ?? []),
        showHints: body.showHints ?? true,
        darkMode: body.darkMode ?? true,
      },
      create: {
        clerkUserId,
        preferredDifficulty: body.preferredDifficulty ?? "Medium",
        preferredCategories: JSON.stringify(body.preferredCategories ?? []),
        showHints: body.showHints ?? true,
        darkMode: body.darkMode ?? true,
      },
    });

    return {
      clerkUserId: preferences.clerkUserId,
      preferredDifficulty: preferences.preferredDifficulty,
      preferredCategories: parseCategories(preferences.preferredCategories),
      showHints: preferences.showHints,
      darkMode: preferences.darkMode,
    };
  }
}
