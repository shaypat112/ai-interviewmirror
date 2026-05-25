import { Injectable } from '@nestjs/common';

type UploadedRecording = {
  mimetype: string;
  originalname: string;
  size: number;
};

@Injectable()
export class AppService {
  getHello(): string {
return `Interview backend running at ${new Date().toISOString()}`;
  }

  processRecording(file?: UploadedRecording) {
    if (!file) {
      return {
        ok: false,
        message: 'No recording file was uploaded. ',
      };
    }

    return {
      ok: true,
      message: 'Recording received successfully.',
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      receivedAt: new Date().toISOString(),
    };
  }
}
