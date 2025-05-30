import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('No token provided.');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.authService.findUserById(payload.id);

      if (!user) throw new UnauthorizedException('User not found.');
      if (!user.isActive) throw new UnauthorizedException('User not active.');

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      const [type, token] =
        (request.headers['authorization'] as string).split(' ') || [];

      return type === 'Bearer' ? token : undefined;
    } catch {
      return undefined;
    }
  }
}
