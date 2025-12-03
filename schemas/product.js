import z from 'zod'

const productSchema = z.object({

  title: z.string()
    .min(5, { message: 'El título es demasiado corto', required_error: 'El título es obligatorio.' })
    .max(200, { message: 'El título es demasiado largo' }),

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

    status: z.string()
    .max(100, { message: 'El estado es demasiado larga' }),

  price: z.number({
    required_error: 'El precio es obligatorio.'
  }).positive({ message: 'El precio debe ser mayor que 0' }),

   sold: z.number()
    .int({ message: 'El valor de "sold" debe ser un número entero' })
    .min(0, { message: 'El mínimo de vendidos es 0' })
    .optional(),

  stock: z.number({
    required_error: 'El número de stock es obligatorio'
  }).int({ message: 'El stock debe ser un número entero' })
    .positive({ message: 'El stock debe ser mayor que 0' }),

  imageurl: z.string().optional(), // 👈 agrega esto
  imageid: z.string().optional(),

  seller: z.string()
    .min(2, { message: 'El nombre es demasiado corto', required_error: 'El vendedor es obligatorio.' })
    .max(150, { message: 'El nombre es demasiado largo' }),
})

export function validateProduct(input) {
  return productSchema.safeParse(input)
}

export function validatePartialProduct(input) {
  return productSchema.partial().safeParse(input)
}
