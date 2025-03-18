import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Patient, PATIENT_STATUS } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export function PatientQueue() {
  const { data: patients } = useQuery<Patient[]>({
    queryKey: ['/api/patients']
  });

  const waitingPatients = patients?.filter(
    patient => patient.status === PATIENT_STATUS.WAITING
  ) || [];

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">Patient Queue</CardTitle>
        <Badge variant="secondary" className="font-medium">
          {waitingPatients.length} Waiting
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {waitingPatients.map((patient, index) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">Token: A{patient.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Est. {15 * (index + 1)} mins
                </span>
              </div>
            </div>
          ))}
          {waitingPatients.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No patients in queue
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
