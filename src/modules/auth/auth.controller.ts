import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticatedResponse } from './interfaces/authenticatedResponse.interface';
import { UserResponse } from './interfaces/userResponse.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user and get the user and token' })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<AuthenticatedResponse> {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user and get the user and token' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<AuthenticatedResponse> {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Revalidate a token and get user data' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('revalidate')
  async revalidate(@Request() req: Request): Promise<AuthenticatedResponse> {
    return this.authService.revalidate(req['user'] as UserResponse);
  }
}
