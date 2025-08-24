import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseData } from 'src/global/globalClass';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ResponseUserDto } from './dto/response-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllUser(
    @Query('page') page = 1,
    @Query('limit') limit = 5
  ): Promise<any> {
    const users = await this.usersService.getAllUser(page, limit);
    return new ResponseData(users, HttpStatus.OK, 'Lấy tất cả user thành công')
  }

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ) {
    const user = await this.usersService.createUser(createUserDto);
    return new ResponseData(user, HttpStatus.CREATED, 'Tạo tài khoản thành công');
  }

  @Put('/me')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseData<UserEntity>> {
    const userId = req.user.id;
    const updatedUser = await this.usersService.updateUser(userId, updateUserDto);
    return new ResponseData<UserEntity>(updatedUser, HttpStatus.CREATED, 'Cập nhật thành công');
  }

  @Patch('/update-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const userId = req.user.id;
    const avatarUrl = await this.usersService.updateAvatar(userId, file);
    return new ResponseData(avatarUrl, HttpStatus.CREATED, 'Cập nhật ảnh thành công');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: number) {
    const message = await this.usersService.deleteUser(userId);
    return new ResponseData(null, HttpStatus.OK, message);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/ban')
  async banUser(
    @Param('id') id: number,
    @Body('hours') hours: number = 1
  ) {
    const user = await this.usersService.banUser(id, hours);
    return new ResponseData(user, HttpStatus.OK, `Ban ${user.username} thành công`);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unban')
  async unbanUser(@Param('id') id: number) {
    const user = await this.usersService.unbanUser(id);
    return new ResponseData(user, HttpStatus.OK, `Gỡ ban ${user.username} thành công`);
  }
}
