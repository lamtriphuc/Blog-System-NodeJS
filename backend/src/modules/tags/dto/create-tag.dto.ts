import { IsNotEmpty } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty({ message: 'Tên tag không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Mô tả tag không được để trống' })
    description: string;
}