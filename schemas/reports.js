import z from 'zod'

const reportSchema = z.object({
    uid: z.string({
      required_error: "El ID del comprador es obligatorio",
    }).uuid("uid debe ser un UUID válido"),

  headline: z.string({
    required_error: 'El título es obligatorio.'
  })
    .min(5, { message: 'El título es demasiado corto' })
    .max(255, { message: 'El título es demasiado largo' }),

  description: z.string({
    required_error: 'La descripción es obligatoria.'
  })
    .min(10, { message: 'La descripción es demasiado corta' }),

  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected'], {
    errorMap: () => ({ message: 'Estado inválido' })
  })
    .default('pending'),

    imageurl: z.string().optional(), // 👈 agrega esto
    imageid: z.string().optional(),

})

export function validateReport(input) {
  return reportSchema.safeParse(input)
}

export function validatePartialReport(input) {
  return reportSchema.partial().safeParse(input)
}
