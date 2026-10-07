import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Tạo người dùng mới với mật khẩu được mã hóa qua bcrypt.hash()
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    const { username, email, password, ...rest } = createUserDto;

    // Kiểm tra trùng lặp username hoặc email
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException(`Username '${username}' đã tồn tại`);
      }
      if (existingUser.email === email) {
        throw new ConflictException(`Email '${email}' đã được đăng ký`);
      }
    }

    // Băm mật khẩu bằng bcrypt với cost factor (saltRounds) = 10
    const password_hash = await bcrypt.hash(password, this.saltRounds);

    const newUser = this.userRepository.create({
      ...rest,
      username,
      email,
      password_hash,
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.sanitizeUser(savedUser);
  }

  /**
   * Lấy danh sách tất cả người dùng (loại bỏ hash mật khẩu)
   */
  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  /**
   * Tìm người dùng theo ID
   */
  async findOne(id: number): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    return this.sanitizeUser(user);
  }

  /**
   * Tìm người dùng theo username (bao gồm cả password_hash để phục vụ xác thực ở AuthModule)
   */
  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   * Tìm người dùng theo email (bao gồm cả password_hash để phục vụ xác thực ở AuthModule)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Cập nhật thông tin người dùng (tự động hash lại nếu có thay đổi mật khẩu)
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }

    // Kiểm tra trùng lặp nếu update username hoặc email
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.findByUsername(updateUserDto.username);
      if (existing) {
        throw new ConflictException(`Username '${updateUserDto.username}' đã tồn tại`);
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException(`Email '${updateUserDto.email}' đã được đăng ký`);
      }
    }

    const { password, ...rest } = updateUserDto;
    let password_hash = user.password_hash;

    if (password) {
      password_hash = await bcrypt.hash(password, this.saltRounds);
    }

    Object.assign(user, rest, { password_hash });
    const updatedUser = await this.userRepository.save(user);
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Xóa người dùng theo ID
   */
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }

    await this.userRepository.remove(user);
    return { message: `Đã xóa người dùng với ID ${id} thành công` };
  }

  /**
   * Helper loại bỏ password_hash khỏi object trả về cho client
   */
  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}
