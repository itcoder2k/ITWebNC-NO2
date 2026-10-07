import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';

export type SafeUser = Omit<User, 'password_hash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Bước 1: Kiểm tra tài khoản (được LocalStrategy gọi).
   * - Tìm user theo username
   * - So sánh mật khẩu thô với password_hash bằng bcrypt.compare
   * - Trả về user (bỏ password_hash) nếu đúng, null nếu sai
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<SafeUser | null> {
    const user = await this.userService.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...result } = user;
    return result;
  }

  /**
   * Bước 2: Cấp token. Tạo payload và gọi JwtService.sign() để sinh accessToken.
   * `sub` là chuẩn JWT cho "subject" (id người dùng).
   */
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
}
