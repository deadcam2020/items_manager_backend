import z from "zod";

export const saleSchema = z.object({

  title: z.string()
    .min(5, { message: 'El título es demasiado corto', required_error: 'El título es obligatorio.' })
    .max(200, { message: 'El título es demasiado largo' }),
    
  buyer_id: z.string({
    required_error: "El ID del comprador es obligatorio",
  }).uuid("buyer_id debe ser un UUID válido"),

  seller_id: z.string({
    required_error: "El ID del vendedor es obligatorio",
  }).uuid("buyer_id debe ser un UUID válido"),

  product_id: z.string({
    required_error: "El ID del producto es obligatorio",
  }).uuid("product_id debe ser un UUID válido"),

  unit_price: z.number({
    required_error: "El precio es obligatorio",
  }).positive("El precio debe ser mayor que 0"),

  payment_method: z.string({
    required_error: "El método de pago es obligatorio",
  }).max(50, "El método de pago es demasiado largo"),

  quantity: z.number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor que 0")
    .optional(), // porque en la tabla el default es 1

  status: z.string()
    .max(50, "El estado es demasiado largo")
    .optional(),  // default: 'completed'

  seller_name: z.string()
    .min(2, { message: 'El nombre es demasiado corto', required_error: 'El vendedor es obligatorio.' })
    .max(150, { message: 'El nombre es demasiado largo' }),


  buyer_name: z.string()
    .min(2, { message: 'El nombre es demasiado corto', required_error: 'El comprador es obligatorio.' })
    .max(150, { message: 'El nombre es demasiado largo' }),

  notes: z.string().optional(),

  imageurl: z.string().optional(),
});

export function validateSale(input) {
  return saleSchema.safeParse(input);
}

export function validatePartialSale(input) {
  return saleSchema.partial().safeParse(input);
}
