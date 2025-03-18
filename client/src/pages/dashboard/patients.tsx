import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PatientTable } from "@/components/patients/table";
import { AddPatient } from "@/components/patients/add-patient";

export default function PatientsPage() {
  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Patient Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage and view patient records
                </p>
              </div>
              <AddPatient />
            </div>
            <PatientTable />
          </main>
        </div>
      </div>
    </div>
  );
}
