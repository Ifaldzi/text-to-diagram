import { AudioWaveform } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import * as React from "react";
import Image from "next/image";

export function AppSidebarHeader() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Image
          src="/app-logo.png"
          alt="application logo"
          width={100}
          height={100}
          className="rounded"
        />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Text To Diagram</span>
      </div>
    </SidebarMenuButton>
  );
}
