import { MYSQL_CONNECTION } from '@app/database/constant';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class AttendanceServiceRepository {
  constructor(@Inject(MYSQL_CONNECTION) private readonly pool: Pool) {}

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

      // 2. If the count is greater than 0, a record exists, so throw an error.
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
}
