import { Injectable } from '@nestjs/common';
import { AttendanceServiceRepository } from 'apps/attendance-service/src/attendance-service.repository';
import { AttendanceHistoryAllRequest, AttendanceStatusRequest } from 'apps/attendance-service/src/interface/attendance.interface';
import {
  CheckInEmployee,
  checkOutEmployee,
} from 'apps/attendance-service/src/interface/checkin.interface';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceServiceRepository,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async checkInEmployee(employeeData: CheckInEmployee) {
    const data = await this.attendanceRepository.checkInUser(
      employeeData.id,
      employeeData.latitude,
      employeeData.longitude,
      employeeData.object_name,
    );

    console.log('succesfully added attendance', data);
    return data;
  }

  async checkOutEmployee(checkoutData: checkOutEmployee) {
    const data = await this.attendanceRepository.checkOutUser(
      checkoutData.id,
      checkoutData.latitude,
      checkoutData.longitude,
    );
    console.log('succesfully added attendance', data);
    return data;
  }

  async getAttendanceStatus(attendanceStatusRequest: AttendanceStatusRequest) {
    const data = await this.attendanceRepository.getAttendanceStatus(
      attendanceStatusRequest,
    );
    console.log('succesfully added attendance', data);
    return data;
  }

  async getAttendanceHistoryAll(attendanceHistoryAllRequest: AttendanceHistoryAllRequest) {
    const data = await this.attendanceRepository.getAttendanceHistoryAll(
      attendanceHistoryAllRequest,
    );
    console.log('succesfully added attendance', data);
    return data;
  }
}
