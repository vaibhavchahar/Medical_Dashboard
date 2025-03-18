import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [compactView, setCompactView] = useState(false);

  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    localStorage.setItem("darkMode", enabled.toString());
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your clinic preferences and notifications
                </p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch 
                        id="email-notifications" 
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <Switch 
                        id="sms-notifications" 
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your dashboard appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch 
                        id="dark-mode" 
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-view">Compact View</Label>
                      <Switch 
                        id="compact-view" 
                        checked={compactView}
                        onCheckedChange={setCompactView}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}