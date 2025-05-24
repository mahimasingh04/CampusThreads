
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import PostForm from "@/components/posts/PostForm";
import { editPostState, isEditingState } from "@/store/PostForm";
import { Post } from "@/types";

interface CreatePostDialogProps {
  post?: Post;  // Optional post for editing
  variant?: "create" | "edit";
}

const CreatePostDialog = ({ post, variant = "create" }: CreatePostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [, setEditPost] = useRecoilState(editPostState);
  const [, setIsEditing] = useRecoilState(isEditingState);
  const isEditingMode = variant === "edit";

  const handleDialogOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    
    if (isOpen) {
      // If opening the dialog, set the post to edit
      setEditPost(post);
      setIsEditing(isEditingMode);
    } else {
      // If closing the dialog, clear the edit state
      setEditPost(undefined);
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        {isEditingMode ? (
          <Button variant="outline" size="sm" className="bg-slate-700 hover:bg-slate-600 text-white border-none">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-none">
            <Plus className="h-4 w-4 mr-1" />
            Create Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle>{isEditingMode ? "Edit Post" : "Create a Post"}</DialogTitle>
        </DialogHeader>
        <PostForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;