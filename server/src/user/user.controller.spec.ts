import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRole } from './entities/user.entity.js';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create and return sanitized user', async () => {
      const dto = {
        username: 'john',
        email: 'john@example.com',
        password: 'password123',
      };
      const expected = {
        user_id: 1,
        username: 'john',
        email: 'john@example.com',
        role: UserRole.CUSTOMER,
        balance: 0,
      };

      mockUserService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      const expected = [{ user_id: 1, username: 'john' }];
      mockUserService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expected = { user_id: 1, username: 'john' };
      mockUserService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update user and return updated info', async () => {
      const updateDto = { display_name: 'John Doe' };
      const expected = { user_id: 1, username: 'john', display_name: 'John Doe' };
      mockUserService.update.mockResolvedValue(expected);

      const result = await controller.update(1, updateDto);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove user and return message', async () => {
      const expected = { message: 'Đã xóa người dùng với ID 1 thành công' };
      mockUserService.remove.mockResolvedValue(expected);

      const result = await controller.remove(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });
});
