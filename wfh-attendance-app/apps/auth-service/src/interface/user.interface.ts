import { Role } from 'apps/auth-service/src/interface/role.interface';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface UserAuth {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  failedLoginAttempts: number;
  passwordHash: string;
  roles: Role[];
}
