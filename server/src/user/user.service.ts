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
  ) { }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    const { username, email, password, ...rest } = createUserDto;

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

  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    return this.sanitizeUser(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

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

  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}
