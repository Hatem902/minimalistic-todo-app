import z from 'zod';

export const todoPostSchema = z.object({
  title: z.string().min(1, {
    message: 'Please enter your todo.',
  }),
});
