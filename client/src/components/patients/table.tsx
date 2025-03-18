import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Edit, Trash } from "lucide-react";
import type { Patient, PatientStatus } from "@shared/schema";
import { PATIENT_STATUS } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<PatientStatus, string> = {
  waiting: "bg-yellow-100 text-yellow-800",
  in_consultation: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<PatientStatus, string> = {
  waiting: "Waiting",
  in_consultation: "In Consultation",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function PatientTable() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients']
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: PatientStatus }) => {
      const res = await apiRequest("POST", `/api/patients/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({
        title: "Success",
        description: "Patient status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "STATUS_UPDATE") {
          queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  const filteredPatients = patients?.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Appointment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients?.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>CCC{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.mobile}</TableCell>
                <TableCell>{patient.email || '-'}</TableCell>
                <TableCell>{patient.lastAppointment || '-'}</TableCell>
                <TableCell>
                  <Badge className={statusColors[patient.status]}>
                    {statusLabels[patient.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedPatient(patient)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Patient
                      </DropdownMenuItem>
                      {Object.entries(PATIENT_STATUS).map(([key, value]) => (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => updateStatusMutation.mutate({ id: patient.id, status: value })}
                          disabled={patient.status === value}
                        >
                          Update Status: {statusLabels[value]}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Patient
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Name</h4>
                  <p>{selectedPatient.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Date of Birth</h4>
                  <p>{selectedPatient.dateOfBirth}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Gender</h4>
                  <p>{selectedPatient.gender}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Mobile</h4>
                  <p>{selectedPatient.mobile}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Email</h4>
                  <p>{selectedPatient.email || '-'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Last Appointment</h4>
                  <p>{selectedPatient.lastAppointment || '-'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Status</h4>
                  <Badge className={statusColors[selectedPatient.status]}>
                    {statusLabels[selectedPatient.status]}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}