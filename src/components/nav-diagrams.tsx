import { useIndexedDb } from "@/data/local/use-indexed-db";
import { Diagram } from "@/data/models/diagram";
import React, { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { ChevronRight, FileChartPie, Folder, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { DiagramNavDto } from "@/data/dto/diagrams/diagram-nav-dto";
import { Stores } from "@/data/local/indexed-db";
import { CreateDiagramDialog } from "./diagrams/create-diagram-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { NavDiagramDropdownMenu } from "./diagrams/nav-diagram-dropdown-menu";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CreateDiagramDropdownMenu } from "./diagrams/create-diagram-dropdown-menu";

export function NavDiagrams() {
  const {
    getAllData,
    insertData,
    deleteDataByKey,
    updateData,
    getDataByKey,
    isDbLoaded,
  } = useIndexedDb();
  const [diagrams, setDiagrams] = useState<DiagramNavDto[]>([]);
  const [diagram, setDiagram] = useState<Diagram | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchDiagrams = async () => {
    const fetchedDiagrams = await getAllData<Diagram>(Stores.Diagrams);
    const diagramNavDtos: DiagramNavDto[] = fetchedDiagrams
      .filter((diagram) => !diagram.parentId)
      .map((diagram) => ({
        id: diagram.id,
        title: diagram.title,
        isFolder: diagram.isFolder,
        isActive: false,
        items: fetchedDiagrams
          .filter((child) => child.parentId === diagram.id)
          .map((child) => ({
            id: child.id,
            title: child.title,
            isActive: false,
          })),
      }));
    setDiagrams(diagramNavDtos);
    if (id) {
      const currentDiagram =
        fetchedDiagrams.find((diagram) => diagram.id === id) || null;
      setDiagram(currentDiagram);
    }
  };

  const insertDiagram = (diagram: Diagram) => {
    insertData<Diagram>(diagram, Stores.Diagrams).then((newDiagram) => {
      fetchDiagrams();
      if (!newDiagram.isFolder) router.push(`?id=${newDiagram.id}`);
    });
  };

  const deleteDiagram = (key: string) => {
    deleteDataByKey(Stores.Diagrams, key).then(() => {
      fetchDiagrams();
      if (key === id) router.replace("/");
    });
  };

  const renameDiagram = (key: string, newTitle: string) => {
    getDataByKey<Diagram>(Stores.Diagrams, key).then((diagram) => {
      if (diagram) {
        diagram.title = newTitle;
        updateData<Diagram>(Stores.Diagrams, diagram).then(() => {
          fetchDiagrams();
          if (key === id) router.refresh();
        });
      }
    });
  };

  useEffect(() => {
    if (isDbLoaded) {
      fetchDiagrams();
    }
  }, [isDbLoaded, id]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex flex-row justify-between">
        Your Diagram
        <CreateDiagramDropdownMenu onInsertDiagram={insertDiagram} />
      </SidebarGroupLabel>
      <SidebarMenu>
        {diagrams.map((item) =>
          item.isFolder ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.id === diagram?.parentId}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    <Folder />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <NavDiagramDropdownMenu
                  onDelete={() => deleteDiagram(item.id)}
                  onRename={(newTitle) => renameDiagram(item.id, newTitle)}
                  onAdd={insertDiagram}
                  currentTitle={item.title}
                  isFolder
                  folderId={item.id}
                />
                <CollapsibleContent>
                  <SidebarMenuSub className="mr-0 pr-0">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.id} className="relative">
                        <SidebarMenuSubButton
                          className="hover:cursor-pointer pr-8"
                          isActive={subItem.id === id}
                          onClick={() => router.push(`?id=${subItem.id}`)}
                        >
                          <FileChartPie />
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                        <NavDiagramDropdownMenu
                          onDelete={() => deleteDiagram(subItem.id)}
                          onRename={(newTitle) =>
                            renameDiagram(subItem.id, newTitle)
                          }
                          currentTitle={subItem.title}
                          subMenu
                        />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={item.id === id}
                onClick={() => router.push(`?id=${item.id}`)}
              >
                <FileChartPie />
                <span>{item.title}</span>
              </SidebarMenuButton>
              <NavDiagramDropdownMenu
                onDelete={() => deleteDiagram(item.id)}
                onRename={(newTitle) => renameDiagram(item.id, newTitle)}
                currentTitle={item.title}
              />
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
