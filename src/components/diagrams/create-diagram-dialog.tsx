import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilePieChart, PieChart, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
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

  const addNewDiagram = () => {
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
            <Button type="submit" onClick={addNewDiagram}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
