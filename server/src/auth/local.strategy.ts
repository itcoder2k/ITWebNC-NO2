import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // Mặc định passport-local đọc `username` và `password` từ req.body
    super();
  }

  /**
   * Passport tự gọi validate() với username/password từ body.
   * Giá trị return được gán vào req.user; throw để trả 401.
   */
  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    return user;
  }
}
