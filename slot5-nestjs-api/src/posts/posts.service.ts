import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { title, content, published, authorId, categoryName } = createPostDto;

    // Check if author exists
    const author = await this.prisma.user.findUnique({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} does not exist`);
    }

    let categoryId: number | undefined = undefined;
    if (categoryName) {
      const category = await this.prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      });
      categoryId = category.id;
    }

    return this.prisma.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        authorId,
        categoryId,
      },
      include: {
        author: true,
        category: true,
      },
    });
  }

  async findAll(published?: boolean) {
    return this.prisma.post.findMany({
      where: published !== undefined ? { published } : {},
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async togglePublish(id: number) {
    const post = await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { published: !post.published },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
