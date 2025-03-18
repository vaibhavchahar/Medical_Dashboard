import type { Express } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPatientSchema, insertDoctorSchema, type Patient, PATIENT_STATUS } from "@shared/schema";

// Keep track of all connected clients
const clients = new Set<WebSocket>();

export async function registerRoutes(app: Express) {
  // Patient routes
  app.get("/api/patients", async (_req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validated = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validated);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: "Invalid patient data" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  // New endpoint to update patient status
  app.post("/api/patients/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!Object.values(PATIENT_STATUS).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const patient = await storage.updatePatientStatus(parseInt(req.params.id), status);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Broadcast the status change to all connected clients
      const message = JSON.stringify({
        type: "STATUS_UPDATE",
        data: patient
      });

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });

      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to update patient status" });
    }
  });

  // Doctor routes
  app.get("/api/doctors", async (_req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.post("/api/doctors", async (req, res) => {
    try {
      const validated = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(validated);
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ message: "Invalid doctor data" });
    }
  });

  const httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        // Handle incoming messages if needed
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });
  });

  return httpServer;
}