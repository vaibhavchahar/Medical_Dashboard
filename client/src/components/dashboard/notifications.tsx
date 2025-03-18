import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Patient",
      message: "Raj Kumar has been added to the waiting list",
      time: "5 mins ago",
      read: false,
    },
    {
      id: "2",
      title: "Status Update",
      message: "Priya Sharma is now in consultation",
      time: "10 mins ago",
      read: false,
    },
    {
      id: "3",
      title: "Appointment Reminder",
      message: "Upcoming appointment with Amit Patel at 2:00 PM",
      time: "15 mins ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  useEffect(() => {
    // Connect to WebSocket for real-time notifications
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "STATUS_UPDATE") {
          const newNotification: Notification = {
            id: Date.now().toString(),
            title: "Patient Status Update",
            message: `${data.data.name}'s status has been updated to ${data.data.status}`,
            time: "Just now",
            read: false,
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-primary-foreground"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="max-h-96 overflow-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start p-4 space-y-1 cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center justify-between w-full">
                <p className="font-medium">{notification.title}</p>
                {!notification.read && (
                  <Badge variant="default" className="bg-primary/10 text-primary">New</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
