import { z } from "zod";

export const sandwichOrderSchema = z.object({
  name: z.string().min(1),
  bread: z.string(),
  sauce: z.string().optional(),
  customer: z.string().optional(),
});

export type SandwichOrderInput = z.infer<typeof sandwichOrderSchema>;
