import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState,  } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
editPostState
} from "@/store/PostForm"

import { PostFormState, Tag, TagDetail, Post, CollaborationRole, TagAcccessCodeMap} from "@/types";
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
      const communityRules = useRecoilValue(communityRulesState);
     const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
      const [tagAccessCodes, setTagAccessCodes] = useRecoilState(tagAccessCodesState);
     const [postForm, setPostForm] = useRecoilState(postFormState);
        const [editPost, setEditPost] = useRecoilState(editPostState);
   const [isLoading, setIsLoading] = useState(true);

     const communities = useRecoilValue(communitiesState);
     const communityTags = useRecoilValue(communityTagsState);
     const selectedCommunity = useRecoilValue(selectedCommunityState);
     const { isValid, allPrivateTagsValid } = useRecoilValue(postFormValidationState);
  const { invalidPrivateTags } = useRecoilValue(privateTagsValidationState);

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




     // Load data if editing an existing post
  useEffect(() => {
    if (postToEdit && postToEdit.isCollaboration && postToEdit.collaborationDetails) {
      const community = communities.find(c => c.id === postToEdit.communityId);
      if (community) setSelectedCommunity(community);
      
      setEventName(postToEdit.title);
      setDescription(postToEdit.content);
      
      if (postToEdit.collaborationDetails) {
        const { eventDate, location, eventLink, rolesNeeded, totalSpots, filledSpots } = postToEdit.collaborationDetails;
        setEventDate(eventDate || "");
        setLocation(location || "");
        setEventLink(eventLink || "");
        setTotalSpots(totalSpots || 0);
        setFilledSpots(filledSpots || 0);
        
        // Load roles
        if (rolesNeeded && rolesNeeded.length > 0) {
          const loadedRoles = rolesNeeded.map(roleName => {
            const predefinedRole = predefinedRoles.find(r => r.name === roleName);
            return predefinedRole || { id: `custom-${Date.now()}-${roleName}`, name: roleName };
          });
          setSelectedRoles(loadedRoles);
        }
        
        // Load tags and their access codes
        if (postToEdit.tags && postToEdit.tags.length > 0) {
          setSelectedTags(postToEdit.tags);
          
          // Load access codes for private tags if available
          // In a real app, this would be handled by the backend
          const accessCodesMap: TagAccessCodeMap = {};
          postToEdit.tags.forEach(tag => {
            if (!tag.isPublic && tag.accessCode) {
              accessCodesMap[tag.id] = tag.accessCode;
            }
          });
          setTagAccessCodes(accessCodesMap);
        }
      }
      
      setAskingForSpots(false);
    }
  }, [postToEdit]);


    useEffect(() => {
        if (selectedCommunityId) {
        const community = communities.find(c => c.id === selectedCommunityId);
        if (community) {
            selectedCommunity(community);
        }
        }
    }, [selectedCommunityId, communities]);


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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTagSelector(true)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Add tags
                </Button>
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
              <label className="text-sm font-medium text-white">Roles Needed</label>
              <div className="flex flex-wrap gap-2">
                {selectedRoles.map((role) => (
                  <Badge 
                    key={role.id} 
                    className="py-1 px-3 bg-blue-700 hover:bg-blue-600 cursor-pointer"
                    onClick={() => removeRole(role.id)}
                  >
                    {role.name}
                    <X size={14} className="ml-1" />
                  </Badge>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRoleSelector(true)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Add Role
                </Button>
              </div>

            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
              <DialogClose asChild>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid || !allPrivateTagsValid}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <Send size={16} /> {isEditing ? "Update" : "Post"}
              </Button>
            </div>
            </div>
            )}
        </div>

           {/* Preview Section */}
      <div className="border-l border-slate-700 pl-4 space-y-4 overflow-y-auto hidden md:block">
        {/* Preview implementation similar to original */}
      </div>

       {/* Modals */}
      {showTagSelector && (
        <TagSelectorModal 
          tags={communityTags}
          selectedTags={selectedTags}
          onSelect={handleTagSelection}
          onClose={() => setShowTagSelector(false)}
        />
      )}
        {showRoleSelector && (
            <RoleSelectorModal 
            roles={predefinedRoles}
            selectedRoles={selectedRoles}
            onSelect={handleRoleSelection}
            onClose={() => setShowRoleSelector(false)}
            />
        )}

          {showAccessCodeInput && (
        <AccessCodeModal
          tag={communityTags.find(t => t.id === showAccessCodeInput)!}
          onSubmit={handleAccessCodeSubmit}
          onClose={() => setShowAccessCodeInput(null)}
        />
      )}
    </div>
    )
    
}

// Helper Components
const TagSelectorModal = ({ tags, selectedTags, onSelect, onClose }) => (
  <AlertDialog open onOpenChange={onClose}>
    <AlertDialogContent className="bg-slate-900 border-slate-700">
      {/* Tag selection UI */}
    </AlertDialogContent>
  </AlertDialog>
);

const RoleSelectorModal = ({ roles, selectedRoles, onSelect, onClose }) => (
  <AlertDialog open onOpenChange={onClose}>
    <AlertDialogContent className="bg-slate-900 border-slate-700">
      {/* Role selection UI */}
    </AlertDialogContent>
  </AlertDialog>
);



const AccessCodeModal = ({ tag, onSubmit, onClose }) => {
  const [code, setCode] = useState("");
  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900 border-slate-700">
        {/* Access code input UI */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CollaborationForm;
