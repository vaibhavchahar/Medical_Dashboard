import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Doctor } from "@shared/schema";

export default function DoctorsPage() {
  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors']
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Doctors</h1>
              <p className="text-sm text-muted-foreground">
                View all doctors and their specializations
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {doctors?.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <CardTitle>{doctor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Specialization: {doctor.specialization}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Clinic: {doctor.clinicId === 1 ? 'Main Clinic' : 'Branch Clinic'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
