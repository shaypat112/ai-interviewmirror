import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { AnalyzeController } from './analyze/analyze.controller';

@Module({
  imports: [UploadModule],
  controllers: [AppController, AnalyzeController],
  providers: [AppService],
})
export class AppModule {}
