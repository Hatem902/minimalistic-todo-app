'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { todoPostSchema } from '@/lib/validations';
import { useAddTodoMutation, useTodosQuery } from '@/hooks/queries';

export default function Home() {
  const { data: todos } = useTodosQuery();
  const { mutate: addTodo } = useAddTodoMutation();
  console.log(todos);

  const form = useForm<z.infer<typeof todoPostSchema>>({
    resolver: zodResolver(todoPostSchema),
    defaultValues: {
      title: '',
    },
  });
  function onSubmit(data: z.infer<typeof todoPostSchema>) {
    addTodo(data);
  }
  return (
    <main className='flex flex-col max-w-prose w-full space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <div className='flex  items-center space-x-2'>
                  <Input type='text' placeholder='Todo' {...field} />
                  <Button type='submit'>Add Todo</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className='flex flex-col space-y-4'>
        {todos?.map((todo) => (
          <div key={todo.id} className='flex space-x-4 items-center'>
            <div>{todo.title}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
