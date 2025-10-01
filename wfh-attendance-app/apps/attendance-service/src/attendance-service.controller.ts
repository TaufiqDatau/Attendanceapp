import { Controller, Get } from '@nestjs/common';
import { AttendanceService } from './attendance-service.service';
import type {
  FilePayload,
  GetUrlPayload,
} from 'apps/attendance-service/src/interface/file.interface';
import { MinioService } from 'apps/attendance-service/src/module/minio-client.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  CheckInEmployee,
  checkOutEmployee,
} from 'apps/attendance-service/src/interface/checkin.interface';
import { CheckOutDto } from 'apps/api-gateway/src/dto/checkin.dto';
import type { AttendanceHistoryAllRequest, AttendanceHistoryUser, AttendanceStatusRequest } from 'apps/attendance-service/src/interface/attendance.interface';
// Define the shape of the data coming from other services

@Controller()
export class AttendanceServiceController {
  constructor(
    private readonly attendanceServiceService: AttendanceService,
    private readonly fileService: MinioService,
  ) { }

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

  @MessagePattern({ cmd: 'check_out_employee' })
  async checkOut(@Payload() payload: checkOutEmployee) {
    const checkOut =
      await this.attendanceServiceService.checkOutEmployee(payload);
    return { checkOut };
  }

  @MessagePattern({ cmd: 'get_attendance_status' })
  async getAttendanceHistory(@Payload() payload: AttendanceStatusRequest) {
    console.log('payload', payload);
    const attendanceHistory =
      await this.attendanceServiceService.getAttendanceStatus(payload);
    return { attendanceHistory };
  }

  @MessagePattern({ cmd: 'get_attendance_history_all' })
  async getAttendanceHistoryAll(@Payload() payload: AttendanceHistoryAllRequest) {
    const attendanceHistoryAll =
      await this.attendanceServiceService.getAttendanceHistoryAll(payload);
    return { attendanceHistoryAll };
  }

  @MessagePattern("get_attendance_proof")
  async getImageProof(@Payload() payload: string) {
    const imageProof = await this.fileService.getFileUrl(payload);
    return { imageProof };
  }

  @MessagePattern({ cmd: 'get_attendance_stats' })
  async getAttendanceStats(@Payload() payload: AttendanceHistoryUser) {
    const attendanceStats =
      await this.attendanceServiceService.getAttendanceStats(payload);
    return { attendanceStats };
  }
}
