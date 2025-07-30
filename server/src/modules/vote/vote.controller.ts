import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseData } from 'src/global/globalClass';

@Controller('api/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: any,
    @Body() createVoteDto: CreateVoteDto
  ) {
    const userId = req.user.id;
    const message = await this.voteService.vote(userId, createVoteDto);
    return new ResponseData(null, HttpStatus.OK, message);
  }
}
