import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-sm text-muted-foreground">
                View and manage appointments
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Appointment Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">10:00 AM</p>
                      <p className="text-sm text-muted-foreground">Raj Kumar - General Checkup</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">11:30 AM</p>
                      <p className="text-sm text-muted-foreground">Priya Sharma - Follow-up</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">2:00 PM</p>
                      <p className="text-sm text-muted-foreground">Amit Patel - Consultation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
