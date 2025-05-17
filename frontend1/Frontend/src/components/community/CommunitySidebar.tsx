
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Community, Rule, User, Tag, BasicCommunity , Moderator} from "@/types";
import { Calendar, Globe, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CreateTagDialog from "./CreateTagDialog";
import { toast } from "sonner"; // Changed from useToast to sonner

type CommunitySidebarProps = {
  community: Community;
  rules: Rule[];
  moderators: Moderator[];
  tags: string[];
  onTagCreated?: (tag: Tag) => void;
};

const CommunitySidebar = ({ community, rules, moderators, tags, onTagCreated }: CommunitySidebarProps) => {
  const [rulesExpanded, setRulesExpanded] = useState<Record<string, boolean>>({});
  const [showAddTagModal, setShowAddTagModal] = useState(false);

  const toggleRuleExpanded = (ruleId: string) => {
    setRulesExpanded(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };

  // Force the moderator status to true for demonstration purposes
  const isModerator = true; // This ensures the create tag dialog is visible

  // Helper function to log when the dialog is opened to verify functionality
  const handleOpenAddTagModal = () => {
    console.log("Opening add tag modal");
    setShowAddTagModal(true);
  };

  return (
    <div className="space-y-4">
      {/* About Community */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-white">About Community</CardTitle>
            {isModerator && onTagCreated && (
              <CreateTagDialog 
                communityId={community.id} 
                onTagCreated={(newTag) => {
                  onTagCreated(newTag);
                  toast.success(`Tag "${newTag.name}" created successfully`); // Using sonner
                }}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-200">{community.description}</p>
          
          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Created {new Date(community.createdAt).toLocaleDateString()}</span>
          </div>
          
          <Separator className="bg-slate-700" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-bold">{community.membersCount}</p>
              <p className="text-sm text-slate-400">Members</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-lg font-bold">267</p>
              </div>
              <p className="text-sm text-slate-400">Online</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 text-slate-300">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Public community</span>
            </div>
            <div className="text-sm">
              <Badge variant="outline" className="bg-slate-700 border-slate-600">
                Top 3%
              </Badge>
            </div>
          </div>

          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => toast.success("Joined community successfully")} // Using sonner
          >
            Join Community
          </Button>
        </CardContent>
      </Card>

      {/* Community Tags */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Community Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags && tags.length > 0 ? (
            tags.map((tag, id) => (
              <Badge 
                key={id} 
                className="bg-slate-700 hover:bg-slate-600 cursor-pointer"
                onClick={() => toast.info(`Showing posts with tag: ${tag}`)} // Using sonner
              >
                {tag}
              </Badge>
            ))
            ) : (
              <p className="text-sm text-slate-400">No tags available</p>
            )}
          </div>
          
          {isModerator && (
            <Button 
              variant="outline"
              onClick={handleOpenAddTagModal}
              className="w-full mt-2 text-sm flex items-center justify-center space-x-1 border-dashed border-slate-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Community Rules */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Community Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id || rule.order} className="space-y-1">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  if (rule.description) {
                    toggleRuleExpanded(rule.id);
                    toast.info(`Rule ${rule.order}: ${rule.title}`); // Using sonner
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{rule.order}.</span>
                  <span className="text-sm font-medium">{rule.title}</span>
                </div>
                {rule.description && (
                  <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                    {rulesExpanded[rule.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              {rule.description && rulesExpanded[rule.id] && (
                <p className="text-sm text-slate-400 ml-6">{rule.description}</p>
              )}
              
              {rules.indexOf(rule) < rules.length - 1 && <Separator className="bg-slate-700 my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Moderators */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Moderators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600"
            onClick={() => toast("Messaging all moderators...")} // Using sonner
          >
            Message Mods
          </Button>
          
          <div className="space-y-3">
            {moderators.map(moderator => (
              <div 
                key={moderator.id} 
                className="flex items-center space-x-2"
                onClick={() => toast.info(`Viewing ${moderator.name}'s profile`)} // Using sonner
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={moderator.avatarUrl} />
                  <AvatarFallback>{moderator.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-slate-200">u/{moderator.name}</span>
                  <Badge className="bg-blue-600 text-xs px-1">MODs</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunitySidebar;

