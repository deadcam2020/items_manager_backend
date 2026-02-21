import z from 'zod'

const userSchema = z.object({
  name: z.string()
    .min(2, { message: 'El nombre es demasiado corto', required_error: 'El nombre es obligatorio.' })
    .optional(),

  adress: z.string()
    .max(255, { message: 'La dirección es demasiado larga' })
    .optional(),

  document: z.string()
    .min(5, { message: 'El documento es demasiado corto' })
    .max(50, { message: 'El documento es demasiado largo' })
    .optional(),

  email: z.string()
    .email({ message: 'Email inválido', required_error: 'El email es obligatorio.' })
    .optional(),

  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .optional(),

  phone: z.string()
    .min(10, { message: 'El teléfono es demasiado corto' })
    .max(10, { message: 'El teléfono es demasiado largo' })
    .optional(),

  department: z.string()
    .max(50, { message: 'El nombre del departamento es demasiado largo' })
    .optional(),

  // 👇 Nuevos campos
  payment_method: z.string()
    .max(100, { message: 'Método de pago demasiado largo' })
    .optional(),

  payment_account: z.string()
    .max(255, { message: 'Número de cuenta demasiado largo' })
    .optional()
})

export function validateUser(input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input)
}
