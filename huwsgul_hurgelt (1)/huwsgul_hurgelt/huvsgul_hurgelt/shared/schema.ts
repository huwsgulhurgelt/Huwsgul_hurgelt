import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const carriers = pgTable("carriers", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  pin: text("pin").notNull(), // keeping it simple as requested
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCarrierSchema = createInsertSchema(carriers).pick({
  phone: true,
  description: true,
  pin: true,
});

export type Carrier = typeof carriers.$inferSelect;
export type InsertCarrier = z.infer<typeof insertCarrierSchema>;

export type CreateCarrierRequest = InsertCarrier;
export type UpdateCarrierRequest = Partial<InsertCarrier> & { pin: string }; // Pin required for authorization
export type DeleteCarrierRequest = { pin: string }; // Pin required for authorization
