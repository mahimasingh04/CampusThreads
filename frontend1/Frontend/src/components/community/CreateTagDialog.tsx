import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tag } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner"; // Replaced useToast with sonner

const tagFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  isPublic: z.boolean(),
  accessCode: z.string().optional(),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

type CreateTagDialogProps = {
  identifier : string;
  onTagCreated: (tag: Tag) => void;
};

const CreateTagDialog = ({ identifier, onTagCreated }: CreateTagDialogProps) => {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
    },
  });
const onSubmit = async (data: TagFormValues) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/community/${identifier}/create-tag`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // If using token auth
        },
        credentials: 'include', // If using cookies
        body: JSON.stringify({
          name: data.name.toUpperCase(),
          description: data.description,
          isPublic: data.isPublic,
          ...(!data.isPublic && { accessCode: data.accessCode }) // Only include if private
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    onTagCreated(result.data); // Assuming your API returns the created tag
    form.reset();
    toast.success("Tag created successfully");
  } catch (error) {
    console.error('Error creating tag:', error);
    toast.error("Failed to create tag");
  }
};


  const watchIsPublic = form.watch("isPublic");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
           <Button variant="outline" className="gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700">
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
        </div>
       
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Tag</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new tag to categorize posts in this community.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Tag Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-slate-900 border-slate-700 text-white" 
                      placeholder="GDG, NSS, EVENTS, etc."
                    />
                  </FormControl>
                  <FormDescription className="text-slate-400">
                    This is how the tag will appear in the community.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-slate-900 border-slate-700 text-white"
                      placeholder="Describe what kind of posts belong under this tag..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">Public Tag</FormLabel>
                    <FormDescription className="text-slate-400">
                      Make this tag visible to all community members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {!watchIsPublic && (
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Access Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-slate-900 border-slate-700 text-white"
                        placeholder="Enter private access code"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      Only users with this code can view posts with this tag.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full">
              Create Tag
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;