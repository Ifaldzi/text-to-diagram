import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { Diagram } from "@/data/models/diagram";

interface props {
  insertData: (diagram: Diagram) => void;
  isFolder?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string | null;
}

export function CreateDiagramDialog({
  insertData,
  open,
  onOpenChange,
  isFolder,
  parentId,
}: props) {
  const [title, setTitle] = useState<string>("");

  const addNewDiagram = (event: FormEvent) => {
    event.preventDefault();
    const newDiagram: Diagram = {
      id: crypto.randomUUID(),
      title: title,
      isFolder: isFolder || false,
      parentId: parentId,
      content: "",
    };
    insertData(newDiagram);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={addNewDiagram} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              Create New {isFolder ? "Folder" : "Diagram"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
