import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts (optional filter by published)' })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  findAll(@Query('published') published?: string) {
    const isPublished = published !== undefined ? published === 'true' : undefined;
    return this.postsService.findAll(isPublished);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post details by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Toggle publish status of a post' })
  togglePublish(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.togglePublish(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
