import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route from the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user object from the request (attached by AuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Check if the user object and their roles exist
    if (!user || !user.roles) {
      return false;
    }

    // Check if the user has at least one of the required roles
    // Based on your JWT: user.roles is [{ name: 'Admin' }]
    return requiredRoles.some((role) =>
      user.roles.some((userRole) => userRole.name === role),
    );
  }
}
