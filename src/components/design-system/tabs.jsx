"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";

// Tabs Root
export function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

// Tabs List
export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px]",
        className
      )}
      {...props}
    />
  );
}

// Tabs Trigger
export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 " +
        "data-[state=active]:text-gray-900 dark:data-[state=active]:text-white " +
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring " +
        "text-gray-700 dark:text-gray-300 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 " +
        "rounded-xl border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap " +
        "transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 " +
        "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 " +
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

// Tabs Content
export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none bg-white dark:bg-slate-800 p-4 rounded-xl",
        className
      )}
      {...props}
    />
  );
}

export default Tabs;
