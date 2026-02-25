import z from "zod/v4";

export const resourceSchema = z.object({
  resource_name: z.string().min(1, "Please provide a resource name"),
});
