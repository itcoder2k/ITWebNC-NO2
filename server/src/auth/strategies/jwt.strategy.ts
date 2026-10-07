import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../user/entities/user.entity.js';

export interface JwtPayload {
  sub: number;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Sau khi Passport xác thực tính hợp lệ của token và hạn dùng,
   * hàm validate sẽ giải mã payload và gán kết quả vào `req.user`.
   */
  async validate(payload: JwtPayload) {
    return {
      user_id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
