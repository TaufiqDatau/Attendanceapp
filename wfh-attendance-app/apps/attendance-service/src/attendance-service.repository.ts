import { MYSQL_CONNECTION } from '@app/database/constant';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiResponse,
  AttendanceHistoryAllRequest,
  AttendanceStatusRequest,
  AttendanceStatusResponse,
  RawAttendanceRecord,
} from 'apps/attendance-service/src/interface/attendance.interface';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import * as mysql from 'mysql2'; // Import for formatting

interface AttendanceRecord extends RowDataPacket {
  time: string;
  action: 'checkin' | 'checkout';
}

@Injectable()
export class AttendanceServiceRepository {
  constructor(@Inject(MYSQL_CONNECTION) private readonly pool: Pool) { }

  private readonly logger = new Logger(AttendanceServiceRepository.name);
  async checkInUser(
    employeeId: number,
    latitude: number,
    longitude: number,
    objectName: string,
  ) {
    const connection = await this.pool.getConnection();
    try {
      const now = new Date();
      const attendanceDate = now.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'

      // --- Start of Validation ---
      // 1. Query to check if a check-in record already exists for this user today.
      const checkSql = `
      SELECT COUNT(*) as count 
      FROM attendance 
      WHERE user_id = ? AND attendance_date = ?
    `;
      const [rows]: any[] = await connection.query(checkSql, [
        employeeId,
        attendanceDate,
      ]);

      console.log(rows);

      if (rows[0].count > 0) {
        throw new ConflictException('User has already checked in today.');
      }
      // --- End of Validation ---

      // 3. If no record was found, proceed with the insertion.
      await connection.beginTransaction();
      const insertSql = `
      INSERT INTO attendance (
        user_id, 
        latitude, 
        longitude, 
        attendance_date, 
        time,
        object_name,
        action
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
      const [result] = await connection.query(insertSql, [
        employeeId,
        latitude,
        longitude,
        attendanceDate,
        now, // Pass the full Date object for the TIMESTAMP column
        objectName,
        'checkin',
      ]);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async checkOutUser(employeeId: number, latitude: number, longitude: number) {
    const connection = await this.pool.getConnection();
    try {
      const now = new Date();
      const attendanceDate = now.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'

      // --- Start of Validation ---
      // 1. Query to check if a check-in record already exists for this user today.
      const checkSql = `
      SELECT COUNT(*) as count 
      FROM attendance 
      WHERE user_id = ? AND attendance_date = ?
      `;
      const [rows]: any[] = await connection.query(checkSql, [
        employeeId,
        attendanceDate,
      ]);

      console.log(rows);

      // 2. If the count is greater than 0, a record exists, so throw an error.
      if (rows[0].count === 0) {
        throw new ConflictException('User has not checked in today.');
      }
      // --- End of Validation ---

      // 3. If no record was found, proceed with the insertion.
      await connection.beginTransaction();
      const insertSql = `
      INSERT INTO attendance (
        user_id, 
        latitude, 
        longitude, 
        attendance_date, 
        time,
        action
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
      const [result] = await connection.query(insertSql, [
        employeeId,
        latitude,
        longitude,
        attendanceDate,
        now, // Pass the full Date object for the TIMESTAMP column
        'checkout',
      ]);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAttendanceStatus(
    payload: AttendanceStatusRequest,
  ): Promise<AttendanceStatusResponse> {
    const connection = await this.pool.getConnection();
    try {
      const { id, date } = payload;
      const attendanceSql = `
      SELECT time,action 
      FROM attendance 
      WHERE user_id = ? AND attendance_date = ?
    `;
      const params = [id, date];
      const [result] = await connection.query<AttendanceRecord[]>(
        attendanceSql,
        params,
      );

      const fullQuery = mysql.format(attendanceSql, params);
      this.logger.debug(`Executing Query: ${fullQuery}`);

      if (result.length === 0) {
        throw new NotFoundException('User not found');
      }
      const attendanceStatus = result.reduce(
        (acc: AttendanceStatusResponse, record: AttendanceRecord) => {
          if (record.action === 'checkin') {
            acc.checkIn = record.time;
          } else if (record.action === 'checkout') {
            acc.checkOut = record.time;
          }
          return acc;
        },
        { checkIn: null, checkOut: null },
      );

      return attendanceStatus;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }


  // --- Define the required interfaces ---

  // The raw data record structure returned by the database query



  // --- Assume this is inside your repository class ---

  async getAttendanceHistoryAll(
    payload: AttendanceHistoryAllRequest,
  ): Promise<ApiResponse> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;

    // The SQL queries to get data and total count remain the same
    const dataSql = `
    SELECT
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        u.email,
        a.attendance_date,
        MIN(CASE WHEN a.action = 'checkin' THEN a.time END) AS checkin_time,
        MIN(CASE WHEN a.action = 'checkin' THEN a.object_name END) AS checkin_object_name,
        MAX(CASE WHEN a.action = 'checkout' THEN a.time END) AS checkout_time,
        MAX(CASE WHEN a.action = 'checkout' THEN a.object_name END) AS checkout_object_name
    FROM
        attendance AS a
    INNER JOIN
        users AS u ON a.user_id = u.id
    GROUP BY
        u.id, a.attendance_date
    ORDER BY
        a.attendance_date DESC
    LIMIT ?
    OFFSET ?;
  `;

    const countSql = `
    SELECT COUNT(*) AS total
    FROM (
        SELECT 1
        FROM attendance AS a
        INNER JOIN users AS u ON a.user_id = u.id
        GROUP BY u.id, a.attendance_date
    ) AS count_subquery;
  `;

    // Execute both queries concurrently
    const [dataResult, countResult] = await Promise.all([
      this.pool.query<RawAttendanceRecord[]>(dataSql, [limit, offset]),
      this.pool.query<{ total: number }[] & RowDataPacket[]>(countSql),
    ]);

    const rawData = dataResult[0];
    const total = countResult[0][0].total;

    // Structure the final return object to match the ApiResponse interface
    return {
      data: rawData,
      totalItem: total,
      currentPage: page,
    };
  }
}
