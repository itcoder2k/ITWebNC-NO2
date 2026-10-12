import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DepositDto } from './dto/deposit.dto.js';
import { User, UserRole } from './entities/user.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

interface AuthenticatedRequest {
  user?: {
    user_id: number;
    username: string;
    role: UserRole;
  };
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<Omit<User, 'password_hash'>[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMyProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.userService.findOne(req.user!.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateMyProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.userService.update(req.user!.user_id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wallet/deposit')
  @HttpCode(HttpStatus.OK)
  depositMyWallet(
    @Request() req: AuthenticatedRequest,
    @Body() depositDto: DepositDto,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.userService.deposit(req.user!.user_id, depositDto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/deposit')
  @HttpCode(HttpStatus.OK)
  deposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() depositDto: DepositDto,
    @Request() req?: AuthenticatedRequest,
  ): Promise<Omit<User, 'password_hash'>> {
    if (
      req?.user &&
      req.user.user_id !== id &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Bạn chỉ có thể nạp tiền vào ví của chính mình',
      );
    }
    return this.userService.deposit(id, depositDto.amount);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req?: AuthenticatedRequest,
  ): Promise<Omit<User, 'password_hash'>> {
    if (
      req?.user &&
      req.user.user_id !== id &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Bạn chỉ có quyền chỉnh sửa hồ sơ của chính mình',
      );
    }
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req?: AuthenticatedRequest,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.update(id, updateUserDto, req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.userService.remove(id);
  }
}

