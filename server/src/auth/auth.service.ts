import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';

export type SafeUser = Omit<User, 'password_hash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<SafeUser | null> {
    let user = await this.userService.findByUsername(usernameOrEmail);
    if (!user && usernameOrEmail.includes('@')) {
      user = await this.userService.findByEmail(usernameOrEmail);
    }
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...result } = user;
    return result;
  }

  login(user: SafeUser) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return this.login(user);
  }

  async getProfile(userId: number): Promise<SafeUser> {
    return this.userService.findOne(userId);
  }
}

