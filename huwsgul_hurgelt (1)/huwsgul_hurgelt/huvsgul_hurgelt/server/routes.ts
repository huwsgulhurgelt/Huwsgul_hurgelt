import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existing = await storage.getCarriers();
  if (existing.length === 0) {
    await storage.createCarrier({
      phone: "99112233",
      description: "Can carry small packages within Murun center. Available 9am-6pm.",
      pin: "1234"
    });
    await storage.createCarrier({
      phone: "88445566",
      description: "Car with large trunk. Can deliver to Khatgal on weekends.",
      pin: "5678"
    });
    await storage.createCarrier({
      phone: "99887766",
      description: "Motorcycle delivery. Fast food or documents.",
      pin: "0000"
    });
    console.log("Database seeded with initial carriers");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/carriers
  app.get(api.carriers.list.path, async (_req, res) => {
    const carriers = await storage.getCarriers();
    res.json(carriers);
  });

  // POST /api/carriers
  app.post(api.carriers.create.path, async (req, res) => {
    try {
      const input = api.carriers.create.input.parse(req.body);
      const carrier = await storage.createCarrier(input);
      res.status(201).json(carrier);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // PUT /api/carriers/:id
  app.put(api.carriers.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const input = api.carriers.update.input.parse(req.body);
      const carrier = await storage.getCarrier(id);

      if (!carrier) {
        return res.status(404).json({ message: "Carrier not found" });
      }

      // PIN Check
      if (carrier.pin !== input.pin) {
        return res.status(401).json({ message: "Invalid PIN" });
      }

      const updated = await storage.updateCarrier(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // POST /api/carriers/:id/delete
  app.post(api.carriers.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const input = api.carriers.delete.input.parse(req.body);
      const carrier = await storage.getCarrier(id);

      if (!carrier) {
        return res.status(404).json({ message: "Carrier not found" });
      }

      // PIN Check
      if (carrier.pin !== input.pin) {
        return res.status(401).json({ message: "Invalid PIN" });
      }

      await storage.deleteCarrier(id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Seed database
  await seedDatabase();

  return httpServer;
}
