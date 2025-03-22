import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";
import { Edit, FileChartPie, MoreHorizontal, Trash } from "lucide-react";
import { DeleteDiagramDialog } from "./delete-diagram-dialog";
import { RenameDiagramDialog } from "./rename-diagram-dialog";
import { CreateDiagramDialog } from "./create-diagram-dialog";
import { Diagram } from "@/data/models/diagram";
import { Button } from "../ui/button";

interface props {
  onDelete: () => void;
  onRename: (title: string) => void;
  onAdd?: (diagram: Diagram) => void;
  currentTitle: string;
  isFolder?: boolean;
  folderId?: string;
  subMenu?: boolean;
}

export function NavDiagramDropdownMenu({
  onDelete,
  onRename,
  onAdd,
  currentTitle,
  isFolder,
  folderId,
  subMenu,
}: props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleOpenDialog = (setDialogOpen: (open: boolean) => void) => {
    setDropdownOpen(false);
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {subMenu ? (
            <Button
              variant="link"
              className="absolute right-1 top-1.5 m-0 p-0 flex aspect-square items-center justify-center w-5 h-5"
            >
              <MoreHorizontal />
            </Button>
          ) : (
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          {isFolder ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleOpenDialog(setAddDialogOpen);
              }}
            >
              <FileChartPie />
              <span>Add Diagram</span>
            </DropdownMenuItem>
          ) : (
            ""
          )}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog(setRenameDialogOpen);
            }}
          >
            <Edit />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog(setDeleteDialogOpen);
            }}
          >
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDiagramDialog
        onDelete={onDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
      <RenameDiagramDialog
        onRename={onRename}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentTitle={currentTitle}
      />
      {onAdd ? (
        <CreateDiagramDialog
          insertData={onAdd}
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          parentId={folderId}
        />
      ) : (
        ""
      )}
    </>
  );
}
