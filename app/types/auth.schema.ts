import { z } from 'zod';

export const RegisterBody = z
  .object({
    name: z.string()
      .trim()
      .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
      .max(256, { message: 'Tên không được vượt quá 256 ký tự' })
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, { message: 'Tên chỉ được chứa chữ cái và khoảng trắng' }),
    
    email: z.string()
      .max(100, { message: 'Email không được vượt quá 100 ký tự' })
      .transform(val => val.toLowerCase().trim()),
    
    password: z.string()
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
      .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
      .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa' })
      .regex(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ thường' })
      .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 số' })
      .regex(/[^A-Za-z0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt' }),
    
    confirmPassword: z.string()
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"]
  });

export type RegisterBodyType = z.infer<typeof RegisterBody>;