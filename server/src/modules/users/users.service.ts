import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    async save(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
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

    async createUser(createUserDto: CreateUserDto) {
        const { username, email, password } = createUserDto;

        const existingUser = await this.userRepository.findOne({
            where: [{ username }, { email }], // username: username
            relations: ['posts', 'comments']
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
        const res = await this.userRepository.save(newUser);
        return new ResponseUserDto(res)
    }

    async getAllUser(page: number, limit: number) {
        page = Number(page);
        limit = Number(limit);

        const [users, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'ASC' },
            relations: ['posts', 'comments']
        })

        // const users = await this.userRepository.find({
        //     relations: ['posts', 'comments'],
        //     order: { id: 'ASC' }
        // });

        const result = users.map(user => new ResponseUserDto(user));
        return {
            users: result,
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        };
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

    async deleteUser(userId: number): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Tài khoản không tồn tại');
        await this.userRepository.remove(user);
        return 'Xóa thành công';
    }


    async banUser(id: number, hours?: number): Promise<ResponseUserDto> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['posts', 'comments'],
        });
        if (!user) throw new NotFoundException(`User với id ${id} không tồn tại`);
        if (user.isBanned) throw new BadRequestException(`User đã bị ban`);

        user.isBanned = true;
        user.bannedUntil = hours
            ? new Date(Date.now() + hours * 60 * 60 * 1000)
            : null;

        await this.userRepository.save(user);

        return new ResponseUserDto(user); // Trả về DTO
    }

    async unbanUser(id: number): Promise<ResponseUserDto> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['posts', 'comments'],
        });
        if (!user) throw new NotFoundException(`User với id ${id} không tồn tại`);
        if (!user.isBanned) throw new BadRequestException(`User chưa bị ban`);

        user.isBanned = false;
        user.bannedUntil = null;
        await this.userRepository.save(user);

        return new ResponseUserDto(user); // Trả về DTO
    }
}
