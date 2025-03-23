import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  children?: React.ReactNode;
  onDelete: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDiagramDialog({ onDelete, open, onOpenChange }: Props) {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Diagram</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this diagram?
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
