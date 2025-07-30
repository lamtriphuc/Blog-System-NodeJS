import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseData } from 'src/global/globalClass';
import { CommentResponseDto } from './dto/response-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Request() req: any,
    @Body() createCommentDto: CreateCommentDto
  ): Promise<ResponseData<CommentResponseDto>> {
    const comment = await this.commentService.createComment(req.user.id, createCommentDto);
    return new ResponseData(comment, HttpStatus.CREATED, 'Comment thành công');
  }

  @Get('/post/:postId')
  async getComments(@Param('postId') postId: number): Promise<ResponseData<CommentResponseDto>> {
    const comments = await this.commentService.getCommentsByPost(postId);
    return new ResponseData(comments, HttpStatus.OK, 'Lấy bình luận thành công');
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateComment(
    @Request() req,
    @Param('id') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<ResponseData<CommentResponseDto>> {
    const updated = await this.commentService.updateComment(req.user.id, commentId, updateCommentDto);
    return new ResponseData(updated, HttpStatus.OK, 'Cập nhật bình luận thành công');
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteComment(
    @Request() req,
    @Param('id') commentId: number
  ) {
    const message = await this.commentService.deleteComment(req.user.id, commentId);
    return new ResponseData(null, HttpStatus.OK, message);
  }
}
