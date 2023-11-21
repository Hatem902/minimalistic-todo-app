'use client';
import { todoPostSchema } from '@/lib/validations';
import { Todo } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
export const useTodosQuery = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<Todo[]> => (await axios.get('/api/todos')).data,
  });

export const useAddTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo: z.infer<typeof todoPostSchema>) =>
      await axios.post(`/api/todos`, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
