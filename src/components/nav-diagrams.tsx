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
import { FileChartPie, Folder } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { DiagramNavDto } from "@/data/dto/diagrams/diagram-nav-dto";
import { Stores } from "@/data/local/indexed-db";
import { useRouter, useSearchParams } from "next/navigation";
import { NavDiagramDropdownMenu } from "./diagrams/nav-diagram-dropdown-menu";
import { CreateDiagramDropdownMenu } from "./diagrams/create-diagram-dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { errorToastProps } from "@/constants/constant";

export function NavDiagrams() {
  const {
    getAllData,
    insertData,
    deleteDataByKey,
    updateData,
    getDataByKey,
    isDbLoaded,
  } = useIndexedDb();
  const { toast } = useToast();
  const [diagrams, setDiagrams] = useState<DiagramNavDto[]>([]);
  const [diagram, setDiagram] = useState<Diagram | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchDiagrams = async () => {
    try {
      const fetchedDiagrams = await getAllData<Diagram>(Stores.Diagrams);
      const diagramNavDtos: DiagramNavDto[] = fetchedDiagrams
        .filter((diagram) => !diagram.parentId)
        .sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.title.localeCompare(b.title);
        })
        .map((diagram) => ({
          id: diagram.id,
          title: diagram.title,
          isFolder: diagram.isFolder,
          isActive: false,
          items: fetchedDiagrams
            .filter((child) => child.parentId === diagram.id)
            .sort((a, b) => a.title.localeCompare(b.title))
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
    } catch (error: any) {
      toast(errorToastProps({ description: error.message }));
    }
  };

  const insertDiagram = (diagram: Diagram) => {
    try {
      insertData<Diagram>(diagram, Stores.Diagrams).then((newDiagram) => {
        if (!newDiagram.isFolder) router.push(`?id=${newDiagram.id}`);
      });
    } catch (error: any) {
      toast(errorToastProps({ description: error.message }));
    }
  };

  const deleteDiagram = (key: string) => {
    try {
      deleteDataByKey(Stores.Diagrams, key).then(() => {
        fetchDiagrams();
        if (key === id) router.replace("/");
      });
    } catch (error: any) {
      toast(errorToastProps({ description: error.message }));
    }
  };

  const renameDiagram = (key: string, newTitle: string) => {
    try {
      getDataByKey<Diagram>(Stores.Diagrams, key).then((diagram) => {
        if (diagram) {
          diagram.title = newTitle;
          updateData<Diagram>(Stores.Diagrams, diagram).then(() => {
            fetchDiagrams();
            if (key === id) router.refresh();
          });
        }
      });
    } catch (error: any) {
      toast(errorToastProps({ description: error.message }));
    }
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
