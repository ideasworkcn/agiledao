import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const token = cookies().get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, email, name, position, role, created_at, status } = await request.json();

  try {
    const userCount = await prisma.user.count();
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    let userRole = role;
    let userStatus = status;
    if (userCount === 0) {
      userRole = 'Scrum Master';
      userStatus = 'Active';
    } else {
      userRole = 'Team Member';
      userStatus = 'Inactive';
    }

    const user = await prisma.user.create({
      data: {
        id,
        email,
        name,
        position,
        role: userRole,
        created_at,
        status: userStatus,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.log("Failed to create user:",error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const token = cookies().get('token')?.value;
  const payload = token ?await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: payload.user_id },
    });

    if (currentUser?.role !== 'Scrum Master') {
      return NextResponse.json({ message: 'Forbidden: User is not a Scrum Master' }, { status: 403 });
    }

    const { id, email, name, position, role, status } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user is the first created user
    const firstUser = await prisma.user.findFirst({
      orderBy: { created_at: 'asc' },
    });

    let updatedData = {
      id,
      email,
      name,
      position,
      role,
      status,
    };

    // If the user is the first user, set role to 'Scrum Master'
    if (firstUser?.id === id) {
      updatedData = { ...updatedData, role: 'Scrum Master' };
    } else {
      updatedData = { ...updatedData, role };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
