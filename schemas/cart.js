import { z } from "zod";

export const AddToCartSchema = z.object({
  id: z.string().uuid({ message: "El id del producto debe ser un UUID válido" }),
  uid: z.string().uuid({ message: "El id del usuario debe ser un UUID válido" }),
  quantity: z.number().int().positive().min(1, "La cantidad mínima es 1")
});

export function validatePrCart(input) {
  return AddToCartSchema.safeParse(input)
}

export function validatePartialCart(input) {
  return AddToCartSchema.partial().safeParse(input)
}
