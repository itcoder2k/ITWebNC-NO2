import {
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login  body: { username, password }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: { user: SafeUser }) {
    return this.authService.login(req.user);
  }

  // GET /api/auth/profile - Yêu cầu Bearer Token (JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { user_id: number; username: string; role: UserRole } }) {
    return req.user;
  }

  // GET /api/auth/admin-only - Yêu cầu Bearer Token & quyền ADMIN (RolesGuard)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  adminOnly() {
    return {
      message: 'Chào mừng Admin! Bạn đã truy cập thành công tài nguyên được bảo vệ.',
    };
  }
}

