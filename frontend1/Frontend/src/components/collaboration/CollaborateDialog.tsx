
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Users } from "lucide-react";
import CollaborationForm from "./CollaborationForm";
import { Post } from "@/types";

interface CollaborateDialogProps {
  post?: Post;  // Optional post for editing
  variant?: "create" | "edit";
}

const CollaborateDialog = ({ post, variant = "create" }: CollaborateDialogProps) => {
  const [open, setOpen] = useState(false);
  const isEditing = variant === "edit";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="outline" size="sm" className="bg-slate-700 hover:bg-slate-600 text-white border-none">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">
            <Users className="h-4 w-4 mr-1" />
            Collaborate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Post" : "Looking for Members"}</DialogTitle>
        </DialogHeader>
        <CollaborationForm onClose={() => setOpen(false)} postToEdit={post} />
      </DialogContent>
    </Dialog>
  );
};

export default CollaborateDialog;