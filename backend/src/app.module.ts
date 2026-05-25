import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UploadModule } from "./upload/upload.module";
import { AnalyzeController } from "./recordings/analyze.controller";
import { SessionsController } from "./recordings/sessions.controller";
import { PreferencesController } from "./recordings/preferences.controller";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [UploadModule],
  controllers: [
    AppController,
    AnalyzeController,
    SessionsController,
    PreferencesController,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
