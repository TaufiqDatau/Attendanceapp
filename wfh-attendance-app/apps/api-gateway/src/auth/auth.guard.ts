// api-gateway/src/auth/auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, of, switchMap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found.');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format.');
    }

    // Send the token to the auth-service for validation
    return this.authClient.send({ cmd: 'validate_token' }, { jwt: token }).pipe(
      switchMap((user) => {
        if (!user) {
          // You could throw an error here, but returning false is often sufficient
          // for the guard to deny access. A custom error from the auth service is better.
          return of(false);
        }
        // Attach the validated user object to the request for later use
        request.user = user;
        return of(true);
      }),
      catchError(() => {
        // If the auth-service throws an error (e.g., token expired), catch it
        throw new UnauthorizedException('Invalid or expired token.');
      }),
    );
  }
}
