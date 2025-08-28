"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar components must be used within <Sidebar>");
  return ctx;
}

export type SidebarProps = {
  children: React.ReactNode;
  collapsed: boolean;
  onCollapsedChange?: (value: boolean) => void;
  className?: string;
  position?: string; // passthrough utility (e.g., "relative", "sticky top-0")
};

export function Sidebar({
  children,
  collapsed,
  onCollapsedChange,
  className,
  position,
}: SidebarProps) {
  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed: (v: boolean) => onCollapsedChange?.(v),
      }}
    >
      <aside
        className={cn(
          "flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          // width transitions for collapse/expand
          collapsed ? "w-[72px]" : "w-64",
          "transition-[width] duration-200 ease-in-out",
          position,
          className
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

export function SidebarHeader({ as: Comp = "div", className, ...props }: SidebarSectionProps) {
  return (
    <Comp
      className={cn(
        "flex items-center gap-3 p-3 border-b border-sidebar-border min-h-14",
        className
      )}
      {...props}
    />
  );
}

export function SidebarBody({ as: Comp = "nav", className, ...props }: SidebarSectionProps) {
  return (
    <Comp className={cn("flex-1 p-2 space-y-1 overflow-y-auto", className)} {...props} />
  );
}

export function SidebarFooter({ as: Comp = "div", className, ...props }: SidebarSectionProps) {
  return (
    <Comp className={cn("p-3 border-t border-sidebar-border", className)} {...props} />
  );
}

export function SidebarText({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const { collapsed } = useSidebarContext();
  return (
    <span
      className={cn(
        "text-sm text-sidebar-foreground",
        // When collapsed, fully hide to avoid occupying layout space
        collapsed ? "hidden" : "opacity-100",
        "transition-opacity duration-150",
        className
      )}
      {...props}
    />
  );
}

export type SidebarItemProps = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
};

export function SidebarItem({ id, label, icon: Icon, active, onSelect, className }: SidebarItemProps) {
  const { collapsed } = useSidebarContext();
  return (
    <button
      type="button"
      title={collapsed ? label : undefined}
      onClick={() => onSelect?.(id)}
      className={cn(
        "w-full inline-flex items-center gap-3 rounded-ele px-3 py-2 text-sm",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/90",
        className
      )}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      <span className={cn("truncate", collapsed && "hidden")}>{label}</span>
    </button>
  );
}

export type SidebarContentProps = React.HTMLAttributes<HTMLElement> & {
  sidebarCollapsed?: boolean; // accepted for API compatibility
  position?: string;
};

export function SidebarContent({
  className,
  sidebarCollapsed: _sidebarCollapsed,
  position,
  ...props
}: SidebarContentProps) {
  return (
    <main className={cn("flex-1 overflow-auto", position, className)} {...props} />
  );
}

export default Sidebar;
