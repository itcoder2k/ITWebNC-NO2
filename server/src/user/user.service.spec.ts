import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserService } from './user.service.js';
import { User, UserRole } from './entities/user.entity.js';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create a user successfully', async () => {
      const dto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        display_name: 'Test User',
      };

      // Mock không có user trùng lặp
      mockRepository.findOne.mockResolvedValue(null);

      mockRepository.create.mockImplementation((userData: any) => ({
        user_id: 1,
        ...userData,
        role: UserRole.CUSTOMER,
        balance: 0,
        created_at: new Date(),
      }));

      mockRepository.save.mockImplementation(async (user: any) => user);

      const result = await service.create(dto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: dto.username }, { email: dto.email }],
      });

      // Kiểm tra mockRepository.create được gọi với password_hash được băm
      expect(mockRepository.create).toHaveBeenCalled();
      const createdArgs = mockRepository.create.mock.calls[0][0];
      expect(createdArgs.password_hash).toBeDefined();
      expect(createdArgs.password_hash).not.toBe(dto.password);

      // Đối chiếu bằng bcrypt.compare
      const isMatch = await bcrypt.compare(dto.password, createdArgs.password_hash);
      expect(isMatch).toBe(true);

      // Kết quả trả về không được chứa password_hash
      expect((result as any).password_hash).toBeUndefined();
      expect(result.username).toBe(dto.username);
      expect(result.email).toBe(dto.email);
    });

    it('should throw ConflictException if username already exists', async () => {
      const dto = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue({
        user_id: 1,
        username: 'existinguser',
        email: 'other@example.com',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue({
        user_id: 1,
        username: 'otheruser',
        email: 'existing@example.com',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all users with password_hash removed', async () => {
      mockRepository.find.mockResolvedValue([
        {
          user_id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password_hash: 'secret_hash_1',
        },
        {
          user_id: 2,
          username: 'user2',
          email: 'user2@example.com',
          password_hash: 'secret_hash_2',
        },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect((result[0] as any).password_hash).toBeUndefined();
      expect((result[1] as any).password_hash).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return sanitized user if found', async () => {
      mockRepository.findOne.mockResolvedValue({
        user_id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'secret_hash',
      });

      const result = await service.findOne(1);
      expect(result.username).toBe('user1');
      expect((result as any).password_hash).toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsername', () => {
    it('should return user including password_hash for authentication (AuthModule)', async () => {
      const mockUser = {
        user_id: 1,
        username: 'testuser',
        password_hash: '$2b$10$hashedpassword',
      };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');
      expect(result).toEqual(mockUser);
      expect(result?.password_hash).toBe('$2b$10$hashedpassword');
    });
  });

  describe('update', () => {
    it('should re-hash password if updated', async () => {
      const existingUser = {
        user_id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'old_hash',
      };
      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockImplementation(async (u: any) => u);

      const updateDto = {
        password: 'newpassword123',
      };

      const result = await service.update(1, updateDto);
      expect((result as any).password_hash).toBeUndefined();
      expect(mockRepository.save).toHaveBeenCalled();

      const savedArg = mockRepository.save.mock.calls[0][0];
      const isMatch = await bcrypt.compare('newpassword123', savedArg.password_hash);
      expect(isMatch).toBe(true);
    });
  });

  describe('remove', () => {
    it('should delete user and return success message', async () => {
      const existingUser = { user_id: 1, username: 'testuser' };
      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.remove.mockResolvedValue(existingUser);

      const result = await service.remove(1);
      expect(result.message).toContain('Đã xóa người dùng với ID 1 thành công');
    });
  });
});
