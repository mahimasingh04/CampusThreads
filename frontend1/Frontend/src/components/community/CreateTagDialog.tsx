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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {  useRecoilState, useRecoilValue} from "recoil";
import { communityTagState} from "@/store/CommunityState";
import { createCommunityTag } from "@/api/community";
import {Tag } from "@/types";

const tagFormSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  isPublic: z.boolean(),
  accessCode: z.string().optional(),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

type CreateTagDialogProps = {
  communityId: string;
};

const CreateTagDialog = ({ communityId }: CreateTagDialogProps) => {
  const [tags, setTags] = useRecoilState<Tag[]>(communityTagState);
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
      accessCode: "",
    },
  });

  const watchIsPublic = form.watch("isPublic");

  const onSubmit = async (data: TagFormValues) => {
    try {
      const newTag = await createCommunityTag(communityId, {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        accessCode: data.isPublic ? undefined : data.accessCode,
      });

      setTags([...tags, newTag]);
      form.reset();
      toast.success("Tag created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create tag");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700">
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
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
                        required={!watchIsPublic}
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