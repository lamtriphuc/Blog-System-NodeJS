import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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

    async findByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email }
        })
        if (user) {
            return user;
        }
        return null;
    }

    async saveRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;

        return this.userRepository.save(user);
    }

    async verifyRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user) {
            const isMatch = bcrypt.compareSync(refreshToken, user.refreshToken);
            if (isMatch) {
                return user;
            }
        }
        return false;
    }

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            ...createUserDto,
            passwordHash: hashedPassword
        }

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async getAllUser(): Promise<any[]> {
        const users = await this.userRepository.find();

        const result = users.map(({ passwordHash, ...data }) => data);
        return result;
    }

    async updateUser(id: number, updateUser: CreateUserDto): Promise<UserEntity> {
        const { username } = updateUser;

        const existingUser = await this.userRepository.findOne({
            where: [{ id }, { username }]
        });

        if (!existingUser) {
            throw new NotFoundException('Tài khoản không tồn tại');
        } else {
            if (existingUser.username === username) {
                throw new ConflictException('Tên người dùng đã tồn tại');
            }
        }

        const updatedUser = await this.userRepository.save({
            ...existingUser,
            ...updateUser
        })
        return updatedUser;
    }
}
