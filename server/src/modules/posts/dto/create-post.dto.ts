import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty({ message: 'Tiêu đề không được bỏ trống' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Nội dung không được bỏ trống' })
    @IsString()
    content: string;

    @IsArray()
    @Transform(({ value }) => {
        try {
            // Nếu là chuỗi thì parse
            return typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
            return [];
        }
    })
    @IsNumber({}, { each: true })
    tagIds: number[];
}