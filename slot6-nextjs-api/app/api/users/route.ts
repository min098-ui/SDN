import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users - Get list of users with their posts
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Cannot connect to database or query data', details: error.message },
      { status: 500 },
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required and must be valid' }, { status: 400 });
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        role: role || 'USER',
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 },
    );
  }
}
