import z from 'zod'

const productSchema = z.object({
  // uid: z.number({
  //   required_error: 'El id del usuario es obligatorio.'
  // }).int({ message: 'El id del usuario debe ser un número entero' }),

  // id: z.number({
  //   required_error: 'El id es obligatorio.'
  // }).int({ message: 'El id del usuario debe ser un número entero' }),

  title: z.string()
    .min(5, { message: 'El título es demasiado corto', required_error: 'El título es obligatorio.' })
    .max(150, { message: 'El título es demasiado largo' }),

  description: z.string()
    .max(2000, { message: 'La descripción es demasiado larga' })
    .optional(),

  valoration: z.number()
    .min(0, { message: 'La valoración mínima es 0' })
    .max(5, { message: 'La valoración máxima es 5' })
    .optional(),

  category: z.string()
    .max(100, { message: 'La categoría es demasiado larga' })
    .optional(),

  price: z.number({
    required_error: 'El precio es obligatorio.'
  }).positive({ message: 'El precio debe ser mayor que 0' }),

  imageurl: z.string().optional(), // 👈 agrega esto
  imageid: z.string().optional()
})

export function validateProduct(input) {
  return productSchema.safeParse(input)
}

export function validatePartialProduct(input) {
  return productSchema.partial().safeParse(input)
}
