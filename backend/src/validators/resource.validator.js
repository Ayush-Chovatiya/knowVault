import { z } from "zod";

const resourceSchema = z.object({
  title: z.string().min(3, "Title must be of atleast 3 characters"),

  link: z.string().url("Link must be a valid URL"),

  category: z.string().min(2, "Category is required"),

  tags: z.array(z.string()).optional(),

  notes: z.string().optional(),

  isFav: z.boolean().optional(),
});

export { resourceSchema };
