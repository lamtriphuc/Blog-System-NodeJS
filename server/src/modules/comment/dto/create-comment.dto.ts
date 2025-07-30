import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    postId: number;

    @IsNotEmpty({ message: 'Nội dung comment không được trống' })
    content: string;
}