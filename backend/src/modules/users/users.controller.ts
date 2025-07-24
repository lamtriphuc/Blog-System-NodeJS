import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Req, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseData } from 'src/global/globalClass';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAllUser(
    @Req() req: Request & { user: string }
  ): Promise<ResponseData<UserEntity[]>> {
    console.log(req.user);
    const users = await this.usersService.getAllUser();
    return new ResponseData<UserEntity[]>(users, HttpStatus.OK, 'Lấy tất cả user thành công')
  }

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<ResponseData<UserEntity>> {
    console.log(createUserDto)
    const user = await this.usersService.createUser(createUserDto);
    return new ResponseData<UserEntity>(user, HttpStatus.CREATED, 'Tạo tài khoản thành công');
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto
  ): Promise<ResponseData<UserEntity>> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return new ResponseData<UserEntity>(updatedUser, HttpStatus.CREATED, 'Cập nhật thành công');
  }
}
