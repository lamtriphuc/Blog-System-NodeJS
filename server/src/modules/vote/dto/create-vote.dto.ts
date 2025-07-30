import { IsEnum, IsNumber } from "class-validator";
import { VoteType } from "src/global/globalEnum";

export class CreateVoteDto {
    @IsNumber()
    postId: number;

    @IsEnum(VoteType)
    voteType: VoteType;
}
