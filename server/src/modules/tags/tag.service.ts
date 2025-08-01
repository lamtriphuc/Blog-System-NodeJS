import { ConflictException, Injectable } from "@nestjs/common";
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

    async getAllTag(): Promise<any> {
        const tags = this.tagRepository.find({
            relations: ['posts']
        });
        return (await tags).map(tag => new TagResponseDto(tag));
    }

    async getTrendingTags(): Promise<TagResponseDto[]> {
        const today = dayjs().startOf('day').toDate();

        const tags = await this.tagRepository
            .createQueryBuilder('tag')
            .leftJoinAndSelect('tag.posts', 'post')
            .where('post.createdAt >= :today', { today })
            .getMany();

        const res = tags
            .map(tag => new TagResponseDto(tag))
            .sort((a, b) => b.postToday - a.postToday);

        return res;
    }
}