import { db } from '@/lib/db';
import { todoPostSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';
import { z } from 'zod';

interface Params {
  todoId: string;
}

export async function DELETE(
  request: Request,
  { params: { todoId } }: { params: Params }
) {
  try {
    await db.todo.delete({
      where: { id: todoId },
    });

    return NextResponse.json({ todoId, deleted: true });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params: { todoId } }: { params: Params }
) {
  try {
    const body = await request.json();
    const todo = todoPostSchema.parse(body);
    const updatedTodo = await db.todo.update({
      where: { id: todoId },
      data: {
        ...todo,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(
      error instanceof z.ZodError ? error.issues : null,
      { status: error instanceof z.ZodError ? 422 : 500 }
    );
  }
}
