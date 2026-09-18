import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Học NestJS và Prisma cực dễ', description: 'Tiêu đề bài viết' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Nội dung chi tiết về cách dựng REST API với NestJS...', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: true, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ example: 1, description: 'ID của tác giả (User)' })
  @IsInt()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({ example: 'Lập trình', required: false, description: 'Tên thể loại (Category)' })
  @IsString()
  @IsOptional()
  categoryName?: string;
}
