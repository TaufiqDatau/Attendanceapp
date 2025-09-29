import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { User } from 'apps/auth-service/src/interface/user.interface';
import { MYSQL_CONNECTION } from '@app/database/constant';

@Injectable()
export class AuthRepository {
  constructor(@Inject(MYSQL_CONNECTION) private readonly pool: Pool) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const sql = `
     SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.status,
        a.password_hash,
        a.failed_login_attempts,
        GROUP_CONCAT(r.name) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN auth a ON u.id = a.user_id
      WHERE u.email = ? 
      GROUP BY u.id
      LIMIT 1; 
    `;
    const [rows] = await this.pool.query(sql, [email]);
    const userRow = (rows as any[])[0];

    if (!userRow) {
      return null;
    }

    // Manually map the raw SQL result to your User interface
    const user: User = {
      id: userRow.id,
      name: `${userRow.first_name} ${userRow.last_name || ''}`.trim(),
      email: userRow.email,
      status: userRow.status,
      passwordHash: userRow.password_hash,
      failedLoginAttempts: userRow.failed_login_attempts,
      roles: userRow.roles
        ? userRow.roles.split(',').map((name) => ({ name }))
        : [],
    };
    console.log(user);

    return user;
  }

  async updateUserLoginAttempts(userId: number, failedLoginAttempts: number) {
    const sql = 'UPDATE auth SET failed_login_attempts = ? WHERE user_id = ?';
    await this.pool.query(sql, [failedLoginAttempts, userId]);
  }
}
