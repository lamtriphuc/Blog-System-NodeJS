import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    // async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    //     try {
    //         const { username, email, password } = createUserDto;

    //         const existingUser = await this.userRepository.findOne({
    //             where: [{ username }, { email }] // username: username
    //         })

    //         if (existingUser) {
    //             if (existingUser.email === email) {
    //                 throw new ConflictException('Email đã tồn tại');
    //             }
    //             if (existingUser.username === username) {
    //                 throw new ConflictException('Tên người dùng đã tồn tại');
    //             }
    //         }

    //         const user = {
    //             ...createUserDto,
    //             passwordHash: password
    //         }

    //         const newUser = this.userRepository.create(user);
    //         return this.userRepository.save(newUser);
    //     } catch (error) {
    //         if (error instanceof ConflictException) {
    //             throw error;
    //         }
    //         throw new InternalServerErrorException('Tạo tài khoản thất bại');
    //     }
    // }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const { username, email, password } = createUserDto;

        const existingUser = await this.userRepository.findOne({
            where: [{ username }, { email }] // username: username
        })

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email đã tồn tại');
            }
            if (existingUser.username === username) {
                throw new ConflictException('Tên người dùng đã tồn tại');
            }
        }

        const user = {
            ...createUserDto,
            passwordHash: password
        }

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
}
