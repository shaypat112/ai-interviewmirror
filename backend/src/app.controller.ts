import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

type UploadedRecording = {
  mimetype: string;
  originalname: string;
  size: number;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/recordings')
  @UseInterceptors(FileInterceptor('recording'))
  uploadRecording(@UploadedFile() file: UploadedRecording | undefined) {
    return this.appService.processRecording(file);
  }
}
