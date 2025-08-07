import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
    @IsNotEmpty({ message: 'Tiêu đề không được bỏ trống' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Nội dung không được bỏ trống' })
    @IsString()
    content: string;

    @IsOptional()
    @IsArray()
    tagIds: number[];

    @IsOptional()
    @IsArray()
    imageUrls: string[];
}