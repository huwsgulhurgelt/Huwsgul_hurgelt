import { carriers, type Carrier, type InsertCarrier } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCarriers(): Promise<Carrier[]>;
  getCarrier(id: number): Promise<Carrier | undefined>;
  createCarrier(carrier: InsertCarrier): Promise<Carrier>;
  updateCarrier(id: number, carrier: Partial<InsertCarrier>): Promise<Carrier>;
  deleteCarrier(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCarriers(): Promise<Carrier[]> {
    return await db.select().from(carriers);
  }

  async getCarrier(id: number): Promise<Carrier | undefined> {
    const [carrier] = await db.select().from(carriers).where(eq(carriers.id, id));
    return carrier;
  }

  async createCarrier(insertCarrier: InsertCarrier): Promise<Carrier> {
    const [carrier] = await db
      .insert(carriers)
      .values(insertCarrier)
      .returning();
    return carrier;
  }

  async updateCarrier(id: number, updates: Partial<InsertCarrier>): Promise<Carrier> {
    const [updated] = await db
      .update(carriers)
      .set(updates)
      .where(eq(carriers.id, id))
      .returning();
    return updated;
  }

  async deleteCarrier(id: number): Promise<void> {
    await db.delete(carriers).where(eq(carriers.id, id));
  }
}

export const storage = new DatabaseStorage();
