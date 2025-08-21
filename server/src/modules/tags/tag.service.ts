import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "src/entities/tag.entity";
import { Repository } from "typeorm";
import { CreateTagDto } from "./dto/create-tag.dto";
import { TagResponseDto } from "./dto/response-tag.dto";
import dayjs = require("dayjs");

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) { }
    async createTag(createTagDto: CreateTagDto): Promise<any> {
        const existingTag = await this.tagRepository.findOne({
            where: { name: createTagDto.name }
        })
        if (existingTag) {
            throw new ConflictException('Tag này đã tồn tại');
        }

        const newTag = await this.tagRepository.create(createTagDto);
        return await this.tagRepository.save(newTag);
    }

    async getAllTagPaninate(page: number, limit: number): Promise<any> {
        const [tags, total] = await this.tagRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['posts']
        });
        const result = await tags.map(tag => new TagResponseDto(tag));
        return {
            tags: result,
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        };
    }

    async getAllTag(): Promise<any> {
        const tags = await this.tagRepository.find({
            relations: ['posts']
        });
        const result = await tags.map(tag => new TagResponseDto(tag));
        return result;
    }

    async getTrendingTags(): Promise<TagResponseDto[]> {
        const startOfMonth = dayjs().startOf('month').toDate();

        const tags = await this.tagRepository
            .createQueryBuilder('tag')
            .leftJoinAndSelect('tag.posts', 'post')
            .where('post.createdAt >= :startOfMonth', { startOfMonth })
            .getMany();

        const res = tags
            .map(tag => new TagResponseDto(tag))
            .sort((a, b) => b.postThisMonth - a.postThisMonth);

        return res;
    }

    async deleteTag(id: number): Promise<void> {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) {
            throw new NotFoundException(`tag với id ${id} không tồn tại`);
        }
        await this.tagRepository.remove(tag);
    }
}