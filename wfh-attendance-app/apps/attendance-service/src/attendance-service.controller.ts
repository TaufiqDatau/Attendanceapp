import { Controller, Get } from '@nestjs/common';
import { AttendanceService } from './attendance-service.service';
import type {
  FilePayload,
  GetUrlPayload,
} from 'apps/attendance-service/src/interface/file.interface';
import { MinioService } from 'apps/attendance-service/src/module/minio-client.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CheckInEmployee } from 'apps/attendance-service/src/interface/checkin.interface';
// Define the shape of the data coming from other services

@Controller()
export class AttendanceServiceController {
  constructor(
    private readonly attendanceServiceService: AttendanceService,
    private readonly fileService: MinioService,
  ) {}

  @Get()
  getHello(): string {
    return this.attendanceServiceService.getHello();
  }

  @MessagePattern({ cmd: 'upload_image' })
  async uploadImage(@Payload() payload: FilePayload) {
    // When sending buffers over microservice transport layers, they are often
    // converted to a different format (e.g., a JSON object with type: 'Buffer').
    // We need to convert it back into a proper Buffer object.
    const fileWithBuffer = {
      ...payload.file,
      buffer: Buffer.from(payload.file.buffer),
    };

    const objectName = await this.fileService.upload(fileWithBuffer);
    return {
      message: 'File uploaded successfully',
      objectName: objectName,
    };
  }

  @MessagePattern({ cmd: 'get_image_url' })
  async getImageUrl(@Payload() payload: GetUrlPayload) {
    const url = await this.fileService.getFileUrl(payload.objectName);
    return { url };
  }

  @MessagePattern({ cmd: 'check_in_employee' })
  async checkIn(@Payload() payload: CheckInEmployee) {
    const checkIn =
      await this.attendanceServiceService.checkInEmployee(payload);
    return { checkIn };
  }
}
