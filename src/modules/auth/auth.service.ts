import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';

import { JwtPayload } from './interfaces/jwtPayload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { AuthenticatedResponse } from './interfaces/authenticatedResponse.interface';
import { UserResponse } from './interfaces/userResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.user({
        ...userData,
        password: bcryptjs.hashSync(password, 10),
      });

      const savedUser = await newUser.save();

      const token = await this.getJwtToken({
        id: (savedUser as unknown as UserResponse).id!,
      });

      return {
        user: savedUser as unknown as UserResponse,
        token,
      };
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.code === 11000)
        throw new UnauthorizedException(
          `${createUserDto.email} already exists`,
        );
      throw new UnauthorizedException('Something went wrong');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthenticatedResponse> {
    const { email, password } = loginUserDto;
    const userDb = await this.user.findOne({ email });
    if (!userDb) throw new UnauthorizedException('User not found!');

    if (!bcryptjs.compareSync(password, userDb.password))
      throw new UnauthorizedException('Invalid credentials!');

    if (!userDb.isActive) throw new UnauthorizedException('User not active!');

    return {
      user: userDb as unknown as UserResponse,
      token: await this.getJwtToken({
        // eslint-disable-next-line
        id: userDb.id,
      }),
    };
  }

  // INFO: utils
  async findUserById(id: string): Promise<UserResponse> {
    const user = await this.user.findOne({ _id: id });
    return user as unknown as UserResponse;
  }

  getJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
