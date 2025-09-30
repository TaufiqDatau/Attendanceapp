import {
  Body,
  Controller,
  DefaultValuePipe,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from 'apps/api-gateway/src/dto/login.dto';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from 'apps/api-gateway/src/dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckInDto, CheckOutDto } from 'apps/api-gateway/src/dto/checkin.dto';
import { AuthGuard } from 'apps/api-gateway/src/auth/auth.guard';
import { HomeLocationDto } from 'apps/api-gateway/src/dto/homeLocation.dto';
import { Roles } from 'apps/api-gateway/src/auth/roles.decorator';
import { GetUsersDto } from 'apps/api-gateway/src/dto/getUsers.dto';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('ATTENDANCE_SERVICE')
    private readonly attendanceClient: ClientProxy,
    private readonly apiGatewayService: ApiGatewayService,
  ) { }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const response = this.authClient.send({ cmd: 'login' }, loginDto);
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Roles('Admin')
  @Post('auth/register')
  async register(@Body() registerDTO: RegisterDto) {
    console.log(registerDTO);
    const response = this.userClient.send('register_user', registerDTO);
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Post('users')
  async getAllUsers(@Req() req: any, @Body() body: GetUsersDto) {
    console.log(body);
    const response = this.userClient.send('get_all_users', body);
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Put('user/update-home-location')
  async updateHomeLocation(
    @Body() homeLocationDto: HomeLocationDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const response = this.userClient.send('update_user_home_location', {
      userId,
      ...homeLocationDto,
    });
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Post('checkin')
  @UseInterceptors(FileInterceptor('file'))
  async checkIn(
    @Body() checkInDto: CheckInDto,
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const { latitude, longitude } = checkInDto;

    // First, upload the image and get the objectName
    const uploadObservable = this.attendanceClient.send(
      { cmd: 'upload_image' },
      { file },
    );
    const uploadData = await firstValueFrom(uploadObservable);
    const objectName = uploadData.objectName;

    try {
      const checkInObservable = this.attendanceClient.send(
        { cmd: 'check_in_employee' },
        {
          id: userId,
          latitude: latitude,
          longitude: longitude,
          object_name: objectName,
        },
      );

      // If this succeeds, `data` will hold the successful response from the service
      const data = await firstValueFrom(checkInObservable);

      // Return a successful response with the data
      return {
        statusCode: 201,
        message: 'Check-in successful',
        data: data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkOut(@Body() checkOutDto: CheckOutDto, @Req() req: any) {
    const userId = req.user.id;
    const { latitude, longitude } = checkOutDto;
    const response = this.attendanceClient.send(
      { cmd: 'check_out_employee' },
      {
        id: userId,
        latitude: latitude,
        longitude: longitude,
      },
    );
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Get('user/home-location')
  async getUserHomeLocation(@Req() req: any) {
    const userId = req.user.id;
    const response = this.userClient.send('get_user_home_location', userId);
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Get('attendance-status/:currentDate')
  async getAttendanceStatus(
    @Req() req: any,
    @Param('currentDate') currentDate: string,
  ) {
    const userId = req.user.id;

    const response = this.attendanceClient.send(
      { cmd: 'get_attendance_status' },
      {
        id: userId,
        date: currentDate,
      },
    );
    return await firstValueFrom(response);
  }

  @UseGuards(AuthGuard)
  @Roles('Admin')
  @Get('attendance-history')
  async getAttendanceHistoryAll(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const payload = { page, limit };

    const response = this.attendanceClient.send(
      { cmd: 'get_attendance_history_all' },
      payload, // Pass the data as the second argument
    );

    return await firstValueFrom(response);
  }
}
