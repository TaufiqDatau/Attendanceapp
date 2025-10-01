import { MYSQL_CONNECTION } from '@app/database/constant';
import { Inject, Injectable } from '@nestjs/common';
import { UserAuth } from 'apps/auth-service/src/interface/user.interface';
import { Register } from 'apps/users-service/src/interface/register.interface';
import { ResultSetHeader, type Pool } from 'mysql2/promise';
import * as bcrypt from 'bcrypt'; // 👈 1. Import bcrypt
import { getAllUserRequest, user } from 'apps/users-service/src/interface/users.interface';

@Injectable()
export class UserRepository {
  constructor(@Inject(MYSQL_CONNECTION) private readonly pool: Pool) { }

  async registerUser(user: Register) {
    // 1. Get a connection from the pool
    const connection = await this.pool.getConnection();

    try {
      // 2. Start the transaction
      await connection.beginTransaction();

      // 3. Insert into the 'users' table
      const userSql = `
      INSERT INTO users (
      first_name, 
      last_name, 
      email, 
      birth_date,
      birth_place,
      phone_number,
      full_address
      ) 
      VALUES (?, ?, ?, ?,?,?,?)
    `;
      const [userResult] = await connection.query<ResultSetHeader>(userSql, [
        user.firstName,
        user.lastName,
        user.email,
        user.birthDate,
        user.birthPlace,
        user.phoneNumber,
        user.fullAddress,
      ]);

      // Get the ID of the new user
      const userId = userResult.insertId;

      if (!userId) {
        throw new Error('Failed to create user, no user ID returned.');
      }

      const saltRounds = 10; // Standard practice for cost factor
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      const authSql = `
          INSERT INTO auth (user_id, password_hash)
          VALUES (?, ?)
        `;
      await connection.query(authSql, [userId, passwordHash]);

      const roleSql = `
          INSERT INTO user_roles (user_id, role_id)
          VALUES (?, ?)
        `;
      await connection.query(roleSql, [userId, 3]);

      await connection.commit();

      return { success: true };
    } catch (error) {
      // 6. If any error occurred, roll back the transaction
      await connection.rollback();

      console.error('Failed to register user:', error);
      // Re-throw the error or return a failure object
      throw error;
    } finally {
      // 7. ALWAYS release the connection back to the pool
      connection.release();
    }
  }

  async updateUser(user: user) {
    const sql = `UPDATE users SET 
    first_name = ?, 
    last_name = ?, 
    email = ?, 
    birth_date = ?, 
    birth_place = ?, 
    phone_number = ?, 
    full_address = ?, 
    status = ?,
    updated_at = NOW()
    WHERE id = ?`;
    const params = [
      user.first_name,
      user.last_name,
      user.email,
      user.birth_date,
      user.birth_place,
      user.phone_number,
      user.full_address,
      user.status.toLowerCase(),
      user.id]
    await this.pool.query(sql, params);

    return { message: 'User updated successfully' };
  }
  async getAllUsers(body: getAllUserRequest) {
    const { page, limit } = body;
    const offset = (page - 1) * limit;
    const sql = 'SELECT * FROM users LIMIT ? OFFSET ?';
    const [rows] = await this.pool.query(sql, [limit, offset]);
    const count = await this.pool.query('SELECT COUNT(*) as count FROM users');
    const response = {
      data: rows,
      total: count[0],
      page,
      limit,
    };

    console.log(response);

    return response;
  }

  async updateUserLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ) {
    const sql =
      'UPDATE users SET home_latitude = ?, home_longitude = ? WHERE id = ?';
    await this.pool.query(sql, [latitude, longitude, userId]);
  }

  async getUserLocation(userId: number) {
    const sql = 'SELECT home_latitude, home_longitude FROM users WHERE id = ?';
    const [rows] = await this.pool.query(sql, [userId]);
    return rows[0];
  }
}
