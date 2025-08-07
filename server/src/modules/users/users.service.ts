import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

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
        const hashedRefreshToken = await bcrypt.hashSync(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;

        return this.userRepository.save(user);
    }

    async verifyRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user || !user.refreshToken) return null;
        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        return isMatch ? user : null;
    }

    async removeRefreshToken(userId: number) {
        await this.userRepository.update(userId, { refreshToken: '' });
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

    async getAllUser(): Promise<ResponseUserDto[]> {
        const users = await this.userRepository.find({
            relations: ['posts', 'comments']
        });

        const result = users.map(user => new ResponseUserDto(user));
        return result;
    }

    async updateUser(id: number, updateUser: UpdateUserDto): Promise<UserEntity> {
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

    async updateAvatar(userId: number, file: Express.Multer.File): Promise<string> {
        const existingUser = await this.userRepository.findOne({
            where: { id: userId }
        })
        if (!existingUser) throw new NotFoundException('Người dùng không tồn tại');
        if (existingUser.avatarUrl) {
            const publicId = await this.cloudinaryService.getPublicId(existingUser.avatarUrl);
            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
            }
        }

        const uploadImage = await this.cloudinaryService.uploadImage(file);
        const avatarUrl = uploadImage.secure_url;

        await this.userRepository.update(userId, { avatarUrl: avatarUrl })

        return avatarUrl;
    }
}
