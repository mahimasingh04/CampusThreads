import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Link, PencilLine, MessageSquare, Send, X, Key, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
 privateTagsValidationState,
 tagAccessCodesState

}  from "@/store/PostForm"
import { PostFormState, Tag, TagDetail} from "@/types";
import { verifyTagAccessCode } from "@/api/tag";

interface PostFormProps {
  onClose?: () => void;
}

const PostForm = ({onClose} : PostFormProps) => {
    const [selectedCommunityId, setSelectedCommunityId]  = useRecoilState(selectedCommunityIdState)
      const communityRules = useRecoilValue(communityRulesState);
     const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
      const [tagAccessCodes, setTagAccessCodes] = useRecoilState(tagAccessCodesState);
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

  const handleTagSelection = (tag : TagDetail) => {
    if(selectedTags.some(t => t.id === tag.id)) {
        setSelectedTags(selectedTags.filter(t => t.id !== tag.id));

        //Also remove the access if it exists
         if (tagAccessCodes[tag.id]) {
        const updatedCodes = { ...tagAccessCodes };
        delete updatedCodes[tag.id];
        setTagAccessCodes(updatedCodes);
      }
    } else {
        // Add the tag
      if (!tag.isPublic) {
        // For private tags, check if we have a valid access code
        const existingCode = tagAccessCodes[tag.id];
        if (existingCode?.isValid) {
          setSelectedTags([...selectedTags, tag]);
        } else {
          setShowAccessCodeInput(tag.id)
        }
    } else {
       setSelectedTags([...selectedTags, tag]);
    }

  }
}

  const removeTag = (tagId : string) => {
      setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));

       if (tagAccessCodes[tagId]) {
      const updatedCodes = { ...tagAccessCodes };
      delete updatedCodes[tagId];
      setTagAccessCodes(updatedCodes);
    }
  }
  
  const handleAccessCodeSubmit =  async(tagId: string, accessCode: string) => {
    try{
      //set loading state
      setTagAccessCodes(prev => ({
        ...prev,
        [tagId] : {code : accessCode, isLoading: true, isValid: false}
      }));
      const {isValid} =  await verifyTagAccessCode(tagId, accessCode)
      if (isValid) {
        // Update state with valid code
        setTagAccessCodes(prev => ({
          ...prev,
          [tagId]: { code: accessCode, isValid: true, isLoading: false }
        }));

          const tagToAdd = communityTags.find(t => t.id === tagId);
        if (tagToAdd) {
          setSelectedTags([
            ...selectedTags,
            tagToAdd
          ]);
        }
        
        toast.success("Access granted!");
    } else {
      setTagAccessCodes(prev => ({
          ...prev,
          [tagId]: { code: accessCode, isValid: false, isLoading: false }
        }));
        toast.error("Invalid access code. Please ask the tag owner/moderator.");
    }
  }catch(error) {
     console.error("Failed to verify access code:", error);
      toast.error("Failed to verify access code. Please try again.");
      setTagAccessCodes(prev => ({
        ...prev,
        [tagId]: { code: accessCode, isValid: false, isLoading: false }
      }));
  }finally {
    setShowAccessCodeInput(null);
  }
}

const handleSubmit = async() => {
  
}


       return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
      <div className="md:col-span-2 space-y-4 overflow-y-auto p-1">
        {/* Community Selection */}
        <div className="space-y-2 relative z-10">
          <label className="text-sm font-medium text-white">Choose a community</label>
          <Select 
            onValueChange={setSelectedCommunityId}
            value={selectedCommunityId || undefined}
          >
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

        {/* Post Type Tabs */}
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
                  maxLength={300}
                />
                <div className="text-right text-xs text-slate-400 mt-1">
                  {postForm.title.length}/300
                </div>
              </div>
              
              {/* Tags section */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 min-h-10 items-center">
                  {selectedTags.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      className={`py-1 px-3 flex items-center gap-1 ${
                        tag.isPublic 
                          ? 'bg-slate-700 hover:bg-slate-600' 
                          : tagAccessCodes[tag.id]?.isValid
                            ? 'bg-purple-700 hover:bg-purple-600'
                            : 'bg-red-700 hover:bg-red-600'
                      } text-white`}
                    >
                      {!tag.isPublic && <Key size={12} className="mr-1" />}
                      {tag.name}
                      {!tag.isPublic && !tagAccessCodes[tag.id]?.isValid && (
                        <span className="text-xs italic ml-1">(needs verification)</span>
                      )}
                      <X 
                        size={14} 
                        className="cursor-pointer" 
                        onClick={() => removeTag(tag.id)}
                      />
                    </Badge>
                  ))}
                  
                  <AlertDialog open={showTagSelector} onOpenChange={setShowTagSelector}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowTagSelector(true)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Add tags
                    </Button>
                    
                    <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Add flair and tags</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          Select tags to categorize your post in {selectedCommunity?.name}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="py-4 max-h-[300px] overflow-y-auto space-y-2">
                        {communityTags.length === 0 ? (
                          <p className="text-slate-400 text-center">No tags available for this community</p>
                        ) : (
                          communityTags.map(tag => (
                            <div key={tag.id} className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id={`tag-${tag.id}`} 
                                checked={selectedTags.some(t => t.id === tag.id)}
                                onChange={() => handleTagSelection(tag)}
                                className="rounded text-orange-500 focus:ring-orange-500 bg-slate-700 border-slate-600"
                                disabled={!tag.isPublic && 
                                  selectedTags.some(t => t.id === tag.id) && 
                                  !tagAccessCodes[tag.id]?.isValid}
                              />
                              <label htmlFor={`tag-${tag.id}`} className="flex-1 text-white">
                                <Badge 
                                  className={`cursor-pointer px-3 py-1 flex items-center ${
                                    selectedTags.some(t => t.id === tag.id) 
                                      ? tag.isPublic 
                                        ? 'bg-orange-500 hover:bg-orange-600'
                                        : tagAccessCodes[tag.id]?.isValid
                                          ? 'bg-purple-500 hover:bg-purple-600'
                                          : 'bg-red-500 hover:bg-red-600'
                                      : tag.isPublic
                                        ? 'bg-slate-700 hover:bg-slate-600'
                                        : 'bg-purple-700 hover:bg-purple-600'
                                  }`}
                                >
                                  {!tag.isPublic && <Key size={12} className="mr-1" />}
                                  {tag.name}
                                  {!tag.isPublic && (
                                    <span className="ml-1 text-xs italic">(Private)</span>
                                  )}
                                </Badge>
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => setShowTagSelector(false)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Add
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  {/* Private Tag Access Code Dialog */}
                  {showAccessCodeInput && (
                    <AlertDialog open={!!showAccessCodeInput} onOpenChange={(open) => !open && setShowAccessCodeInput(null)}>
                      <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white flex items-center">
                            <Key className="mr-2" /> Private Tag Access Code
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            This tag is private. Please enter the access code to use this tag.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        
                        <div className="py-4">
                          <Input
                            type="password"
                            placeholder="Enter access code"
                            className="bg-slate-800 border-slate-700 text-white"
                            id="access-code-input"
                            disabled={tagAccessCodes[showAccessCodeInput]?.isLoading}
                          />
                          {tagAccessCodes[showAccessCodeInput]?.isValid === false && (
                            <p className="text-red-400 text-sm mt-2">
                              Wrong access code. Please ask the tag owner/moderator.
                            </p>
                          )}
                        </div>
                        
                        <AlertDialogFooter>
                          <AlertDialogCancel 
                            className="bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white"
                            disabled={tagAccessCodes[showAccessCodeInput]?.isLoading}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={async () => {
                              const accessCode = (document.getElementById("access-code-input") as HTMLInputElement).value;
                              if (accessCode) {
                                await handleAccessCodeSubmit(showAccessCodeInput, accessCode);
                              } else {
                                toast.error("Please enter an access code");
                              }
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                            disabled={tagAccessCodes[showAccessCodeInput]?.isLoading}
                          >
                            {tagAccessCodes[showAccessCodeInput]?.isLoading ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" /> Verifying...
                              </span>
                            ) : (
                              "Submit"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              
              {/* Content based on selected tab */}
              <TabsContent value="text" className="space-y-4">
                <Textarea 
                  placeholder="What's on your mind?" 
                  className="min-h-[200px] bg-slate-800 border-slate-700 text-white"
                  value={postForm.content}
                  onChange={(e) => handleFormChange('content', e.target.value)}
                />
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image size={40} className="text-slate-500" />
                    <p className="text-slate-300">Drag and drop images or videos here</p>
                    <Button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white">
                      Upload
                    </Button>
                  </div>
                </div>
                {postForm.imageUrl && (
                  <div className="mt-4">
                    <p className="text-slate-300 mb-2">Current image:</p>
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                      <img src={postForm.imageUrl} alt="Current upload" className="max-h-32 mx-auto" />
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="link" className="space-y-4">
                <Input 
                  placeholder="URL" 
                  className="bg-slate-800 border-slate-700 text-white"
                  type="url"
                  value={postForm.linkUrl}
                  onChange={(e) => handleFormChange('linkUrl', e.target.value)}
                />
              </TabsContent>
            </Tabs>
            
            {/* Submit buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
              <DialogClose asChild>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                onClick={handleSubmit}
                disabled={!isValid || postForm.isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                {postForm.isSubmitting ? "Posting..." : (
                  <>
                    <Send size={16} /> Post
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Rules Sidebar */}
      <div className="border-l border-slate-700 pl-4 space-y-4 overflow-y-auto hidden md:block">
        <h3 className="font-semibold text-lg text-white">Posting to {selectedCommunity?.name || "..."}</h3>
        
        {selectedCommunity && (
          <>
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h4 className="font-medium mb-3 border-b border-slate-700 pb-2 text-orange-500">Community Rules</h4>
              
              {communityRules.length > 0 ? (
                <ol className="list-decimal pl-5 space-y-4">
                  {communityRules.map((rule) => (
                    <li key={rule.order} className="text-sm text-white">
                      <p className="font-medium">{rule.title}</p>
                      {rule.description && (
                        <p className="text-slate-300 text-xs mt-1">{rule.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-300 text-sm">No specific rules for this community.</p>
              )}
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h4 className="font-medium mb-2 text-orange-500">About {selectedCommunity.name}</h4>
              <p className="text-sm text-slate-300 mb-3">{selectedCommunity.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  {selectedCommunity.memberCount.toLocaleString()} members
                </div>
                <span>•</span>
                <div> 4 online</div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default PostForm