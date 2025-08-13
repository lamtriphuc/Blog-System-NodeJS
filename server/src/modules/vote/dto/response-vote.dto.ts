import { IsEnum, IsNumber } from "class-validator";
import { VoteEntity } from "src/entities/vote.entity";
import { VoteType } from "src/global/globalEnum";

export class ResponseVoteDto {
    postId: number;
    voteType: VoteType;

    constructor(vote: VoteEntity) {
        this.postId = vote.post.id;
        this.voteType = vote.voteType;
    }
}
