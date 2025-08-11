import z from "zod";

export const CommonResponse = <T extends z.ZodTypeAny = z.ZodAny>(
  dataSchema: T = z.any() as unknown as T
) =>
  z
    .object({
      status: z.number(),
      message: z.string(),
      data: dataSchema.nullable(),
      success: z.boolean(),
    })
    .strict();

export type CommonResponseType = z.infer<typeof CommonResponse>;
