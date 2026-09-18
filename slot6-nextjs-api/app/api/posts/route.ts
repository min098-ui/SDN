import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/posts - Get list of posts (filter by ?published=true supported)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedParam = searchParams.get('published');

    const whereCondition: any = {};
    if (publishedParam !== null) {
      whereCondition.published = publishedParam === 'true';
    }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to query posts', details: error.message },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, published, authorId, categoryName } = body;

    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Post title and authorId are required' },
        { status: 400 },
      );
    }

    // Verify author exists
    const author = await prisma.user.findUnique({
      where: { id: Number(authorId) },
    });
    if (!author) {
      return NextResponse.json(
        { error: `Author with ID ${authorId} not found` },
        { status: 404 },
      );
    }

    let categoryId: number | undefined = undefined;
    if (categoryName && typeof categoryName === 'string') {
      const category = await prisma.category.upsert({
        where: { name: categoryName.trim() },
        update: {},
        create: { name: categoryName.trim() },
      });
      categoryId = category.id;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content: content || null,
        published: Boolean(published),
        authorId: Number(authorId),
        categoryId,
      },
      include: {
        author: true,
        category: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 },
    );
  }
}
