import { z } from "zod";

export const reservationSchema = z.object({
  service_id: z.string().uuid(),
  team_member_id: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  customer_name: z.string().min(1).max(200),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().min(6).max(20),
  notes: z.string().max(1000).optional(),
  whatsapp_opt_in: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1).max(5000),
  consent: z.literal(true),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
