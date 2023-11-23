import { db } from '@/lib/db';
import { todoPostSchema } from '@/lib/validations';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
export async function GET() {
  try {
    const todos = await db.todo.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request as NextRequest);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const todo = todoPostSchema.parse(body);
    const createdTodo = await db.todo.create({
      data: {
        ...todo,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json(createdTodo);
  } catch (error) {
    return NextResponse.json(
      error instanceof z.ZodError ? error.issues : null,
      { status: error instanceof z.ZodError ? 422 : 500 }
    );
  }
}
