"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  active: string;
  setActive: (v: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({ active: "", setActive: () => {} });

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [active, setActive] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-white/10 p-1 text-white/60", className)}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { active, setActive } = React.useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        active === value ? "bg-white/20 text-white shadow-sm" : "hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className={cn("mt-4", className)} {...props} />;
}
