import { MYSQL_CONNECTION } from '@app/database/constant';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'apps/auth-service/src/interface/user.interface';
import { Register } from 'apps/users-service/src/interface/register.interface';
import { ResultSetHeader, type Pool } from 'mysql2/promise';
import * as bcrypt from 'bcrypt'; // 👈 1. Import bcrypt

@Injectable()
export class UserRepository {
  constructor(@Inject(MYSQL_CONNECTION) private readonly pool: Pool) {}

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
      full_address,
      phone_number ) 
      VALUES (?, ?, ?, ?,?,?,?)
    `;
      const [userResult] = await connection.query<ResultSetHeader>(userSql, [
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber,
        user.birthDate,
        user.birthPlace,
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
}
