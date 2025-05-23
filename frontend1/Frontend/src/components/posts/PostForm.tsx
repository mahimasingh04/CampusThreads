import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Link, PencilLine, MessageSquare, Send, X, Key } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    selectedCommunityIdState,
  communitiesState,
  communityRulesState,
  communityTagsState,
  selectedTagsState,
  selectedCommunityState,
 postFormState,
 postFormValidationState,
 privateTagsValidationState

}  from "@/store/PostForm"
import { PostFormState } from "@/types";

interface PostFormProps {
  onClose?: () => void;
}

const PostForm = ({onClose} : PostFormProps) => {
    const [selectedCommunityId, setSelectedCommunityId]  = useRecoilState(selectedCommunityIdState)
     const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
     const [postForm, setPostForm] = useRecoilState(postFormState);


     const communities = useRecoilValue(communitiesState);
     const communityTags = useRecoilValue(communityTagsState);
     const selectedCommunity = useRecoilValue(selectedCommunityState);
     const { isValid, allPrivateTagsValid } = useRecoilValue(postFormValidationState);
  const { invalidPrivateTags } = useRecoilValue(privateTagsValidationState);

    const [showTagSelector, setShowTagSelector] = useState(false);
    const [showAccessCodeInput, setShowAccessCodeInput] = useState<string | null>(null);

   // Handle form field changes
  const handleFormChange = (field: keyof PostFormState, value: string | boolean) => {
    setPostForm(prev => ({ ...prev, [field]: value }));
  };
       return (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
      <div className="md:col-span-2 space-y-4 overflow-y-auto p-1"></div>

        {/* Community Selection */}
        <div className="space-y-2 relative z-10">
          <label className="text-sm font-medium text-white">Choose a community</label>
          <Select 
            onValueChange={setSelectedCommunityId}
            value={selectedCommunityId || undefined}>

                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select a community" />
            </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
              {communities.map((community) => (
                <SelectItem key={community.id} value={community.id}>
                  <div className="flex items-center gap-2">
                    {community.image ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700">
                        <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {community.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-white">{community.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
            </Select>

           
            </div>


            {selectedCommunityId && (
          <div className="space-y-4">
            <Tabs 
              defaultValue="text" 
              value={postForm.type} 
              onValueChange={(value) => handleFormChange('type', value)} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 bg-slate-800">
                <TabsTrigger value="text" className="flex items-center gap-2 text-white">
                  <PencilLine size={16} /> Text
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2 text-white">
                  <Image size={16} /> Images & Video
                </TabsTrigger>
                <TabsTrigger value="link" className="flex items-center gap-2 text-white">
                  <Link size={16} /> Link
                </TabsTrigger>
              </TabsList>

               {/* Title input */}
              <div className="my-4">
                <Input 
                  placeholder="Title" 
                  className="bg-slate-800 border-slate-700 text-lg text-white"
                  value={postForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  maxLength={50}
                />
                <div className="text-right text-xs text-slate-400 mt-1">
                  {postForm.title.length}/50
                </div>
              </div>

              
      </div>
       )
}