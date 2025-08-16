import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
    @IsNumber()
    postId: number;

    @IsString()
    @IsNotEmpty()
    reason: string;
}