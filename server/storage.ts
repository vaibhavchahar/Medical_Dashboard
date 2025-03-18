import { type Patient, type InsertPatient, type Doctor, type InsertDoctor, type PatientStatus, PATIENT_STATUS } from "@shared/schema";

export interface IStorage {
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatientStatus(id: number, status: PatientStatus): Promise<Patient | undefined>;
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
}

export class MemStorage implements IStorage {
  private patients: Map<number, Patient>;
  private doctors: Map<number, Doctor>;
  private currentPatientId: number;
  private currentDoctorId: number;

  constructor() {
    this.patients = new Map();
    this.doctors = new Map();
    this.currentPatientId = 1;
    this.currentDoctorId = 1;

    // Add sample patients
    const samplePatients = [
      { name: "Raj Kumar", dateOfBirth: "1985-05-15", gender: "Male", mobile: "+91 98765 43210", email: "raj@example.com", lastAppointment: "2025-03-15", status: PATIENT_STATUS.WAITING },
      { name: "Priya Sharma", dateOfBirth: "1992-08-22", gender: "Female", mobile: "+91 98765 43211", email: "priya@example.com", lastAppointment: "2025-03-14", status: PATIENT_STATUS.IN_CONSULTATION },
      { name: "Amit Patel", dateOfBirth: "1978-12-03", gender: "Male", mobile: "+91 98765 43212", email: "amit@example.com", lastAppointment: "2025-03-16", status: PATIENT_STATUS.COMPLETED },
      { name: "Deepa Gupta", dateOfBirth: "1990-03-28", gender: "Female", mobile: "+91 98765 43213", email: "deepa@example.com", lastAppointment: "2025-03-12", status: PATIENT_STATUS.WAITING },
      { name: "Vikram Singh", dateOfBirth: "1982-07-19", gender: "Male", mobile: "+91 98765 43214", email: "vikram@example.com", lastAppointment: "2025-03-11", status: PATIENT_STATUS.WAITING },
      { name: "Meera Reddy", dateOfBirth: "1995-01-08", gender: "Female", mobile: "+91 98765 43215", email: "meera@example.com", lastAppointment: "2025-03-17", status: PATIENT_STATUS.IN_CONSULTATION },
      { name: "Suresh Kumar", dateOfBirth: "1975-11-30", gender: "Male", mobile: "+91 98765 43216", email: "suresh@example.com", lastAppointment: "2025-03-13", status: PATIENT_STATUS.WAITING },
      { name: "Anita Desai", dateOfBirth: "1988-04-25", gender: "Female", mobile: "+91 98765 43217", email: "anita@example.com", lastAppointment: "2025-03-18", status: PATIENT_STATUS.COMPLETED },
      { name: "Rahul Verma", dateOfBirth: "1993-09-12", gender: "Male", mobile: "+91 98765 43218", email: "rahul@example.com", lastAppointment: "2025-03-10", status: PATIENT_STATUS.WAITING },
      { name: "Neha Kapoor", dateOfBirth: "1987-06-17", gender: "Female", mobile: "+91 98765 43219", email: "neha@example.com", lastAppointment: "2025-03-09", status: PATIENT_STATUS.CANCELLED }
    ];

    samplePatients.forEach(patient => this.createPatient(patient));

    // Add sample doctors
    const sampleDoctors = [
      { name: "Dr. Vaibhav Chahar", specialization: "General Physician", clinicId: 1 },
      { name: "Dr. Priyanka Chopra", specialization: "Pediatrician", clinicId: 1 },
      { name: "Dr. Rajesh Kumar", specialization: "Orthopedic", clinicId: 1 },
      { name: "Dr. Anjali Singh", specialization: "Gynecologist", clinicId: 2 },
      { name: "Dr. Sanjay Gupta", specialization: "Neurologist", clinicId: 2 }
    ];

    sampleDoctors.forEach(doctor => this.createDoctor(doctor));
  }

  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const patient: Patient = { 
      id, 
      ...insertPatient,
      status: insertPatient.status || PATIENT_STATUS.WAITING 
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatientStatus(id: number, status: PatientStatus): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;

    const updatedPatient = { ...patient, status };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const doctor: Doctor = { id, ...insertDoctor };
    this.doctors.set(id, doctor);
    return doctor;
  }
}

export const storage = new MemStorage();