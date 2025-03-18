import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  lastAppointment: text("last_appointment"),
  status: text("status").default("waiting").notNull(), // Added status field
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  doctorId: integer("doctor_id").references(() => doctors.id),
  date: text("date").notNull(),
  status: text("status").notNull(),
});

export const insertClinicSchema = createInsertSchema(clinics);
export const insertDoctorSchema = createInsertSchema(doctors);
export const insertPatientSchema = createInsertSchema(patients);
export const insertAppointmentSchema = createInsertSchema(appointments);

export type Clinic = typeof clinics.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;

export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Patient status types
export const PATIENT_STATUS = {
  WAITING: "waiting",
  IN_CONSULTATION: "in_consultation",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type PatientStatus = typeof PATIENT_STATUS[keyof typeof PATIENT_STATUS];