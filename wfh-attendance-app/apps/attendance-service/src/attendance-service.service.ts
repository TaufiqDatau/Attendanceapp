import { Injectable } from '@nestjs/common';
import { AttendanceServiceRepository } from 'apps/attendance-service/src/attendance-service.repository';
import { CheckInEmployee } from 'apps/attendance-service/src/interface/checkin.interface';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceServiceRepository,
  ) {}
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
}
