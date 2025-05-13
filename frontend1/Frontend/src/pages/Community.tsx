import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { communityIdState, communityState, communityDataState, loadingState, sortOptionState } from '@/store/CommunityState';
import { Tag } from "@/types";
import CommunityHeader from "@/components/community/CommunityHeader";


import CommunitySidebar from "@/components/community/CommunitySidebar";
import { toast } from "sonner";
import { createCommunityTag } from "@/api/Community";

const Community = () => {
  const { communityId } = useParams();
  const setCurrentCommunityId = useSetRecoilState(communityIdState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [sortOption, setSortOption] = useRecoilState(sortOptionState);
  
  const community = useRecoilValue(communityState);
  const communityData = useRecoilValue(communityDataState);

  useEffect(() => {
    const fetchCommunityData = () => {
      setLoading(true);
      try {
        setCurrentCommunityId(communityId);
        if (community) {
          toast.success(`Welcome to ${community.name}!`);
        }
      } catch (error) {
        toast.error("Failed to load community data");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId, community, setCurrentCommunityId, setLoading]);

  const handleTagCreated = async (newTag: Tag) => {
    try {
      if (!communityId) return;
      
      const createdTag = await createCommunityTag(communityId, {
        name: newTag.name,
        description: newTag.description,
        isPublic: newTag.isPublic,
        accessCode: newTag.accessCode
      });
      
      toast.success(`Tag "${createdTag.name}" created successfully`);
      
    } catch (error) {
      toast.error("Failed to create tag");
      console.error("Tag creation error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  

  return (
    <>
      <CommunityHeader community={community} />
      
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          
            <div className="md:col-span-1">
            <CommunitySidebar 
              community={community}
              rules={communityData.rules}
              moderators={communityData.moderators}
              tags={communityData.tags.map((tag: Tag) => tag.name)}
              onTagCreated={handleTagCreated}
            />
            </div>
        </div>
      </div>
    </>
  );
};

export default Community;