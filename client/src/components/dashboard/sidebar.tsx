import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  Settings,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Doctors", href: "/dashboard/doctors", icon: Stethoscope },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full border-r bg-gradient-to-b from-background to-muted/20 shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Arogya Care</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200",
                  location === item.href
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted hover:shadow-sm"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t">
        <button className="flex items-center gap-3 px-4 py-3 text-sm w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}