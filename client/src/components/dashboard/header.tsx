import { Button } from "@/components/ui/button";
import { CalendarDays, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CLINIC_OPTIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <Select defaultValue="1">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select clinic" />
            </SelectTrigger>
            <SelectContent>
              {CLINIC_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <CalendarDays className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Dr. Vaibhav Chahar</p>
              <p className="text-xs text-muted-foreground">General Physician</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}