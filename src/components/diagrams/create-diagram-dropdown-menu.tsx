import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";
import {
  Edit,
  FilePieChart,
  Folder,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { DeleteDiagramDialog } from "./delete-diagram-dialog";
import { RenameDiagramDialog } from "./rename-diagram-dialog";
import { Button } from "../ui/button";
import { CreateDiagramDialog } from "./create-diagram-dialog";
import { Diagram } from "@/data/models/diagram";

interface props {
  onInsertDiagram: (diagram: Diagram) => void;
}

export function CreateDiagramDropdownMenu({ onInsertDiagram }: props) {
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isFolder, setIsFolder] = useState<boolean>(false);

  const handleOpenDialog = (
    setDialogOpen: (open: boolean) => void,
    isFolder = false
  ) => {
    setDropdownOpen(false);
    setIsFolder(isFolder);
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="p-0">
            <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog(setCreateDialogOpen);
            }}
          >
            <FilePieChart />
            <span>Create Diagram</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog(setCreateDialogOpen, true);
            }}
          >
            <Folder />
            <span>Create Folder</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateDiagramDialog
        insertData={onInsertDiagram}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        isFolder={isFolder}
      />
    </>
  );
}
