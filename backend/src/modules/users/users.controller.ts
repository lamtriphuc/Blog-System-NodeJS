import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseData } from 'src/global/globalClass';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<ResponseData<UserEntity>> {
    console.log(createUserDto)
    const user = await this.usersService.createUser(createUserDto);
    return new ResponseData<UserEntity>(user, HttpStatus.CREATED, 'Tạo tài khoản thành công');
  }
}
