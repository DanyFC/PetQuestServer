import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponse } from './interfaces/userResponse.interface';
import { AuthenticatedResponse } from './interfaces/authenticatedResponse.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<AuthenticatedResponse> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<AuthenticatedResponse> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('revalidate')
  async revalidate(@Request() req: Request): Promise<AuthenticatedResponse> {
    return this.authService.revalidate(req['user'] as UserResponse);
  }
}
