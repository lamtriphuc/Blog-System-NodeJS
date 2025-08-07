import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Req, Request, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseData } from 'src/global/globalClass';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAllUser(
  ): Promise<ResponseData<ResponseUserDto[]>> {
    const users = await this.usersService.getAllUser();
    return new ResponseData<ResponseUserDto[]>(users, HttpStatus.OK, 'Lấy tất cả user thành công')
  }

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<ResponseData<UserEntity>> {
    console.log(createUserDto)
    const user = await this.usersService.createUser(createUserDto);
    return new ResponseData<UserEntity>(user, HttpStatus.CREATED, 'Tạo tài khoản thành công');
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
}
