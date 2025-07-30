import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdatePostDto {
    @IsNotEmpty({ message: 'Tiêu đề không được bỏ trống' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Nội dung không được bỏ trống' })
    @IsString()
    content: string;

    @IsArray()
    tagIds: number[];

    @IsArray()
    imageUrls: string[];
}