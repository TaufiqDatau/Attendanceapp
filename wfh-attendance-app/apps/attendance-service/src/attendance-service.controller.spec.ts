import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceServiceController } from './attendance-service.controller';
import { AttendanceService } from './attendance-service.service';

describe('AttendanceServiceController', () => {
  let attendanceServiceController: AttendanceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceServiceController],
      providers: [AttendanceService],
    }).compile();

    attendanceServiceController = app.get<AttendanceServiceController>(
      AttendanceServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(attendanceServiceController.getHello()).toBe('Hello World!');
    });
  });
});
