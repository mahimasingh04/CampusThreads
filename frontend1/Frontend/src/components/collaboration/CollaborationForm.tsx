import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState,  } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link as LinkIcon, MapPin, Plus, Send, X, Key } from "lucide-react";
import { Card } from "../ui/card";
import { DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
 tagAccessCodesState,
editPostState,
isEditingState
} from "@/store/PostForm"

import { PostFormState, Tag, TagDetail, Post, CollaborationRole} from "@/types";
import { verifyTagAccessCode } from "@/api/tag";

interface CollaborationFormProps {
  onClose?: () => void;
  postToEdit?: Post;
}


const predefinedRoles: CollaborationRole[] = [
  { id: "1", name: "React Developer" },
  { id: "2", name: "UI/UX Designer" },
  { id: "3", name: "ML Engineer" },
  { id: "4", name: "Backend Developer" },
  { id: "5", name: "DevOps Engineer" },
  { id: "6", name: "Product Manager" },
  { id: "7", name: "Mobile Developer" },
  { id: "8", name: "Data Scientist" },
];


const CollaborationForm = ({onClose, postToEdit} :CollaborationFormProps) => {
      const [selectedCommunityId, setSelectedCommunityId]  = useRecoilState(selectedCommunityIdState)
    
     const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
      const [tagAccessCodes, setTagAccessCodes] = useRecoilState(tagAccessCodesState);
     const [postForm, setPostForm] = useRecoilState(postFormState);
     const [isEditing, setIsEditing] = useRecoilState(isEditingState);
      const [editPost, setEditPost] = useRecoilState(editPostState);
      const [isLoading, setIsLoading] = useState(true);

     const communities = useRecoilValue(communitiesState);
     const communityTags = useRecoilValue(communityTagsState);
     const selectedCommunity = useRecoilValue(selectedCommunityState);
     const { isValid, allPrivateTagsValid } = useRecoilValue(postFormValidationState);
   
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [showAccessCodeInput, setShowAccessCodeInput] = useState<string | null>(null);



    const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<CollaborationRole[]>([]);
   const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customRole, setCustomRole] = useState("");
  const [totalSpots, setTotalSpots] = useState<number>(0);
  const [filledSpots, setFilledSpots] = useState<number>(0);
  const [askingForSpots, setAskingForSpots] = useState<boolean>(true);




    useEffect(() => {
    if (postToEdit) {
      setIsEditing(true);
      setEditPost(postToEdit);
      initializeEditState(postToEdit);
    }
    return () => {
      setIsEditing(false);
      setEditPost(undefined);
    };
  }, [postToEdit]);


   useEffect(() => {
    if (communities.length > 0) {
      setIsLoading(false);
    }
  }, [communities]);

  
    const initializeEditState = (post: Post) => {
    setSelectedCommunityId(post.communityId);
    setPostForm({
      title: post.title,
      content: post.content,
      type: "collaboration",
      imageUrl: post.imageUrl || "",
      linkUrl: post.linkUrl || "",
      isSubmitting: false
    });

    if (post.collaborationDetails) {
      setEventDate(post.collaborationDetails.eventDate || "");
      setLocation(post.collaborationDetails.location || "");
      setEventLink(post.collaborationDetails.eventLink || "");
      setTotalSpots(post.collaborationDetails.totalSpots || 0);
      setFilledSpots(post.collaborationDetails.filledSpots || 0);
      
      const roles = post.collaborationDetails.rolesNeeded.map(name => 
        predefinedRoles.find(r => r.name === name) || { id: `custom-${Date.now()}-${name}`, name }
      );
      setSelectedRoles(roles);
    }

  if (post.tags) {
      setSelectedTags(post.tags);
      const codes = post.tags.reduce((acc, tag) => {
        if (tag.accessCode) {
          acc[tag.id] = {
            code: tag.accessCode,
            isValid: true,
            isLoading: false
          };
        }
        return acc;
      }, {} as Record<string, { code: string; isValid?: boolean; isLoading?: boolean }>);
      setTagAccessCodes(codes);
    }
  };

   const handleTagSelection = (tag: TagDetail) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      removeTag(tag.id);
    } else {
      if (!tag.isPublic) {
        setShowAccessCodeInput(tag.id);
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleAccessCodeSubmit =  async (tagId : string, code: string) => {
     setTagAccessCodes(prev => ({
    ...prev,
    [tagId]: {
      code,
      isValid: undefined, // Reset validation state
      isLoading: true
    }
  }));

  try {
    const isValid = await verifyTagAccessCode(tagId, code);
    setTagAccessCodes(prev => ({
      ...prev,
       [tagId]: {
        code,
        isValid: isValid,
        isLoading: false
      }
    }))
    if (isValid) {
      const tag = communityTags.find(t => t.id === tagId);
      if (tag) {
        setSelectedTags([...selectedTags, tag]);
        toast.success(`Access code accepted for tag: ${tag.name}`);
      }
    } else {
      toast.error("Invalid access code. Please try again.");
    }

  }catch(error) {
    console.error("Error verifying access code:", error);
    setTagAccessCodes(prev => ({
      ...prev,
      [tagId]: {
        code,
        isValid: false,
        isLoading: false
      }
    }));
    toast.error("Failed to verify access code. Please try again later.");
  }
  }

    const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    setTagAccessCodes(prev => {
      const newCodes = { ...prev };
      delete newCodes[tagId];
      return newCodes;
    });
  };

   const removeRole = (roleId: string) => {
    setSelectedRoles(selectedRoles.filter(role => role.id !== roleId));
   };

   const handleRoleSelection = (role: CollaborationRole) => {
      setSelectedRoles(prev => 
      prev.some(r => r.id === role.id)
        ? prev.filter(r => r.id !== role.id)
        : [...prev, role]
    );
   }


    const addCustomRole = () => {
    if (customRole.trim() && !selectedRoles.some(r => r.name.toLowerCase() === customRole.toLowerCase())) {
      setSelectedRoles(prev => [
        ...prev,
        { id: `custom-${Date.now()}`, name: customRole.trim() }
      ]);
      setCustomRole("");
    }
  };

  const handleSpotsChange = (value: string) => {
    const spotsValue = parseInt(value);
    if (!isNaN(spotsValue) && spotsValue > 0) {
      setTotalSpots(spotsValue);
      setAskingForSpots(false);
    }
  };

   const handleSubmit = async () => {
    if (!isValid || !allPrivateTagsValid) {
      toast.error("Please resolve all validation issues before submitting.");
      return;
    }

    setIsSubmitting(true);
   

    try {
      // Call API to create or update the post
      if (isEditing && editPost) {
        // Update existing post logic here
        // await updatePost(editPost.id, postData);
        toast.success("Collaboration post updated successfully!");
      } else {
        // Create new post logic here
        // await createPost(postData);
        toast.success("Collaboration post created successfully!");
      }
      
      onClose?.();
    } catch (error) {
      console.error("Error submitting collaboration form:", error);
      toast.error("Failed to submit collaboration post. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
                        <img src={community.image} alt={community.name} />
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

           {selectedCommunity && (
          <div className="space-y-4">
            {/* Event Header */}
            <div className="bg-indigo-600 p-4 rounded-md text-white">
              <div className="flex justify-between items-start">
                <div>
                  <Input
                    placeholder="Hackathon Title"
                    className="text-2xl font-bold bg-transparent border-none focus:outline-none p-0 w-full text-white"
                    value={postForm.title}
                    onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                   <div className="flex items-center mt-2 space-x-2 text-white">
                    <Calendar size={16} />
                    <Input
                      placeholder="Event Date"
                      className="bg-transparent border-none focus:outline-none p-0 text-white"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                    <span>•</span>
                    <MapPin size={16} />
                    <Input
                      placeholder="Location"
                      className="bg-transparent border-none focus:outline-none p-0 text-white"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <span className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  Looking for members
                </span>
              </div>
            </div>


             <div className="space-y-2">
              <label className="text-sm font-medium text-white">Event Link (optional)</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="https://hackathon-website.com" 
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                  value={eventLink}
                  onChange={(e) => setEventLink(e.target.value)}
                />
              </div>
            </div>

    {            /* Tags section*/ }
       <div className="space-y-2">
              <label className="text-sm font-medium text-white">Tags</label>
              <div className="flex flex-wrap gap-2 min-h-10 items-center">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    className={`py-1 px-3 flex items-center gap-1 ${
                      tag.isPublic ? 'bg-slate-700' : 'bg-purple-700'
                    } ${tagAccessCodes[tag.id]?.isValid === false ? 'bg-red-700' : ''} hover:opacity-80`}
                  >
                    {!tag.isPublic && <Key size={12} className="mr-1" />}
                    {tag.name}
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
                      <AlertDialogTitle className="text-white">Add tags</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Select tags to categorize your collaboration post
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
                            />
                            <label htmlFor={`tag-${tag.id}`} className="flex-1 text-white">
                              <Badge 
                                className={`cursor-pointer px-3 py-1 flex items-center ${
                                  selectedTags.some(t => t.id === tag.id) 
                                    ? tag.isPublic 
                                      ? 'bg-orange-500 hover:bg-orange-600'
                                      : 'bg-purple-500 hover:bg-purple-600'
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
                          onChange={(e) => {
                            // In a real app, we would validate this against the backend
                          }}
                          id="collab-access-code-input"
                        />
                        <p className="text-xs text-slate-400 mt-2">
                          {/* Comment: In a real application, this would verify the code with the backend */}
                          Ask the tag creator or community moderator for the access code
                        </p>
                      </div>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => {
                            // Get the current tag being processed
                            const tag = communityTags.find(t => t.id === showAccessCodeInput);
                            const accessCode = (document.getElementById("collab-access-code-input") as HTMLInputElement).value;
                            
                            if (tag && accessCode) {
                              handleAccessCodeSubmit(tag.id, accessCode);
                              // Now add the tag since access code is provided
                              setSelectedTags([...selectedTags, tag]);
                            } else {
                              toast.error("Please enter an access code");
                            }
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          Submit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

              </div>
            </div>
      

     {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Team Project Description</label>
              <Textarea 
                placeholder="Describe your project..." 
                className="min-h-[100px] bg-slate-800 border-slate-700 text-white"
                value={postForm.content}
                onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            {/* Roles Needed */}

              <div className="space-y-2">
              <label className="text-sm font-medium text-white">Looking for:</label>
              <div className="flex flex-wrap gap-2 min-h-10 items-center">
                {selectedRoles.map((role) => (
                  <Badge 
                    key={role.id} 
                    className="bg-slate-700 hover:bg-slate-600 text-white py-1 px-3 flex items-center gap-1"
                  >
                    {role.name}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => removeRole(role.id)}
                    />
                  </Badge>
                ))}
                 <AlertDialog open={showRoleSelector} onOpenChange={setShowRoleSelector}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowRoleSelector(true)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Add roles
                  </Button>
                   <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Add team roles</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Select the roles you're looking for
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                     <div className="py-4 max-h-[300px] overflow-y-auto space-y-2">
                      <div className="flex items-center gap-2 mb-4">
                        <Input
                          placeholder="Add custom role..."
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                        <Button 
                          onClick={addCustomRole}
                          disabled={!customRole.trim()}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                         {predefinedRoles.map(role => (
                        <div key={role.id} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`role-${role.id}`} 
                            checked={selectedRoles.some(r => r.id === role.id)}
                            onChange={() => handleRoleSelection(role)}
                            className="rounded text-indigo-500 focus:ring-indigo-500 bg-slate-700 border-slate-600"
                          />
                           <label htmlFor={`role-${role.id}`} className="flex-1 text-white">
                            <Badge 
                              className={`cursor-pointer px-3 py-1 ${
                                selectedRoles.some(r => r.id === role.id) 
                                  ? 'bg-indigo-500 hover:bg-indigo-600' 
                                  : 'bg-slate-700 hover:bg-slate-600'
                              }`}
                            >
                              {role.name}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                     <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => setShowRoleSelector(false)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        Add
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                 </div>
            </div>

             {/* Team Composition */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Team Composition:</label>
              {askingForSpots ? (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-300">How many members do you need?</label>
                  <Input 
                    type="number" 
                    min="1"
                    className="w-20 bg-slate-800 border-slate-700 text-white"
                    onChange={(e) => handleSpotsChange(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
                      {totalSpots - filledSpots}
                    </div>
                    <span className="text-sm text-slate-300 mt-1">Spots left</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                      {filledSpots}
                    </div>
                    <span className="text-sm text-slate-300 mt-1">Filled</span>
                  </div>
                </div>
              )}
            </div>

               {/* Submit buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
              <DialogClose asChild>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                onClick={handleSubmit}
                disabled={!selectedCommunity || !eventName.trim() || !description.trim() || totalSpots <= 0 || isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                {isSubmitting ? (isEditing ? "Updating..." : "Posting...") : (
                  <>
                    <Send size={16} /> {isEditing ? "Update" : "Post"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Section */}
      <div className="border-l border-slate-700 pl-4 space-y-4 overflow-y-auto hidden md:block">
        <h3 className="font-semibold text-lg text-white">Post Preview</h3>
        
        {selectedCommunity && eventName && (
          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{eventName || "Hackathon Title"}</h3>
                  <div className="flex items-center mt-1 space-x-2 text-white/80 text-sm">
                    {eventDate && (
                      <>
                        <Calendar size={14} />
                        <span>{eventDate}</span>
                      </>
                    )}
                    {location && (
                      <>
                        <span>•</span>
                        <MapPin size={14} />
                        <span>{location}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  Looking for members
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium mb-2 text-white">Team Information</h4>
              <p className="text-slate-300 text-sm mb-4">{description || "Team project description will appear here..."}</p>
              
              {/* Tags preview */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      className={`${
                        tag.isPublic ? 'bg-slate-700' : 'bg-purple-700 flex items-center'
                      } text-white`}
                    >
                      {!tag.isPublic && <Key size={12} className="mr-1" />}
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              {selectedRoles.length > 0 && (
                <>
                  <h4 className="font-medium mb-2 text-white">Looking for:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedRoles.map(role => (
                      <Badge key={role.id} className="bg-slate-700 text-white">{role.name}</Badge>
                    ))}
                  </div>
                </>
              )}
              
              {!askingForSpots && (
                <>
                  <h4 className="font-medium mb-2 text-white">Team Composition:</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-bold">
                        {totalSpots - filledSpots}
                      </div>
                      <span className="text-xs text-slate-300 mt-1">Spots left</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg font-bold">
                        {filledSpots}
                      </div>
                      <span className="text-xs text-slate-300 mt-1">Filled</span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-6">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Apply to Join Team
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        <div className="text-sm text-slate-300 italic">
          <p>This is a preview of how your post will appear to other users.</p>
          <p className="mt-2">Fill out all the details on the left to see the complete preview.</p>
        </div>
      </div>
    </div>


      );
    }
           
export default CollaborationForm ;
