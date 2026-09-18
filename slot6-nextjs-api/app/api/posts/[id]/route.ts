import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/posts/[id] - Get a single post by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: `Post with ID ${id} not found` }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to query post', details: error.message },
      { status: 500 },
    );
  }
}

// PATCH /api/posts/[id] - Update post details or publish status
export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const body = await request.json();

    const updatedPost = await prisma.post.update({
      where: { id },
      data: body,
      include: {
        author: true,
        category: true,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[id] - Delete a post by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: `Post #${id} deleted successfully` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 },
    );
  }
}
