import { z } from 'zod';

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} es obligatorio.`);

const emailSchema = requiredText('El correo')
  .max(150, 'El correo no puede superar 150 caracteres.')
  .email('Ingresa un correo válido.');

const javaWhitespaceOnly = /^[\u0009-\u000d\u001c-\u0020\u1680\u2000-\u2006\u2008-\u200a\u2028\u2029\u205f\u3000]*$/u;

const passwordSchema = z
  .string()
  .min(1, 'La contraseña es obligatoria.')
  .refine((value) => !javaWhitespaceOnly.test(value), {
    message: 'La contraseña es obligatoria.',
  })
  .refine((value) => value.length >= 8 && value.length <= 72, {
    message: 'La contraseña debe tener entre 8 y 72 caracteres.',
  })
  .refine((value) => {
    const byteLength = new TextEncoder().encode(value).length;
    return byteLength >= 8 && byteLength <= 72;
  }, {
    message: 'La contraseña debe ocupar entre 8 y 72 bytes UTF-8.',
  });

export const loginSchema = z.object({
  correo: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio.')
    .refine((value) => value.trim().length > 0, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede superar 100 caracteres.'),
  correo: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
