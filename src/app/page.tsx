import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DiagramPage from "./components/diagram-page";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense>
          <DiagramPage />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
