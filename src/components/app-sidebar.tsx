"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { NavDiagrams } from "./nav-diagrams";
import { NavDocumentaion } from "./nav-documentation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense>
          <NavDiagrams />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavDocumentaion />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
