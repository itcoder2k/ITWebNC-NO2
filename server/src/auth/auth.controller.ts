import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService, SafeUser } from './auth.service.js';
import { LocalAuthGuard } from './local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';
import { UserRole } from '../user/entities/user.entity.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: { user: SafeUser }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: { user: { user_id: number; username: string; role: UserRole } },
  ) {
    return this.authService.getProfile(req.user.user_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  adminOnly() {
    return {
      message: 'Chào mừng Admin! Bạn đã truy cập thành công tài nguyên được bảo vệ.',
    };
  }
}

