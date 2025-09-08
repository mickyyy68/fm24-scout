"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarText,
} from "@/components/ui/Sidebar";
import { Settings, Users, FileText, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

type AppLayoutProps = {
  children: React.ReactNode;
  activePage?: "players" | "squad" | "settings";
  onSelectPage?: (page: "players" | "squad" | "settings") => void;
};

export function AppLayout({ children, activePage = "players", onSelectPage }: AppLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar position="relative" collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <SidebarHeader className="relative flex items-center">
          <div className={"flex items-center gap-3 " + (collapsed ? "" : "pr-8") }>
            <img
              className="rounded-ele bg-background border border-border shrink-0"
              src="/logo.png"
              width={35}
              height={35}
              alt="App"
            />
            <SidebarText className="font-semibold text-lg">FM24 Scout</SidebarText>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </SidebarHeader>

        <SidebarBody>
          <SidebarItem
            id="players"
            label="Players"
            icon={FileText}
            active={activePage === "players"}
            onSelect={() => onSelectPage?.("players")}
          />
          <SidebarItem
            id="squad"
            label="Squad"
            icon={Users}
            active={activePage === "squad"}
            onSelect={() => onSelectPage?.("squad")}
          />
          <SidebarItem
            id="settings"
            label="Settings"
            icon={Settings}
            active={activePage === "settings"}
            onSelect={() => onSelectPage?.("settings")}
          />
        </SidebarBody>

        <SidebarFooter>
          <div className="flex items-center gap-2">
            <SidebarText className="text-sm text-muted-foreground">Theme</SidebarText>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="ml-auto"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarContent sidebarCollapsed={collapsed} position="relative" className="p-6">
        {children}
      </SidebarContent>
    </div>
  );
}

export default AppLayout;
