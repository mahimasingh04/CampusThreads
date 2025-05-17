import { useParams } from "react-router-dom";
import { useEffect, useState,Suspense, startTransition } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import { communityIdentifierState, communityState, communityDataState, loadingState } from '@/store/CommunityState';
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { toast } from "sonner";
import { createCommunityTag } from "@/api/Community";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/Loading";
import {Tag} from "@/types";



const Community = () => {
  const { identifier } = useParams();
  const setCurrentCommunityIdentifier = useSetRecoilState(communityIdentifierState);
   const [isInitialized, setIsInitialized] = useState(false);



  useEffect(() => {
    if (identifier && !isInitialized) {
      console.log("Initial identifier set:", identifier);
      setCurrentCommunityIdentifier(identifier);
      setIsInitialized(true);
    }
  
  
    
  }, [identifier, isInitialized, setCurrentCommunityIdentifier]);


  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
       {isInitialized && <CommunityContent />}

      </Suspense>
    </ErrorBoundary>
  );
};





const CommunityContent = () => {
  
  
  const communityLoadable = useRecoilValueLoadable(communityState) || {};
  const communityDataLoadable = useRecoilValueLoadable(communityDataState) ||{};


   

 if (communityLoadable.state === 'loading') {
    return <LoadingSpinner />;
  }

    if (communityLoadable.state === 'hasError' || !communityLoadable.contents) {
    return <div>Community not found</div>;
  }

 const community = communityLoadable.contents;
  const communityData = communityDataLoadable.contents;

  

  console.log("Community:", community);
  console.log("CommunityData:", communityData);
  console.log("CommunityContent rendered");
   
  const handleTagCreated = async (newTag: Tag) => {
    try {
      if (!community?.id) return;
      
      const createdTag = await createCommunityTag(community.id, {
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

  

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Community not found</p>
      </div>
    );
  }

  return (
    <>
      <CommunityHeader community= {community }/>
                       
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CommunitySidebar 
              community={community}
              rules={communityData?.rules || []}
              moderators={communityData?.moderators || []}
            tags={Array.isArray(communityData?.tags) ? communityData.tags.map((tag: Tag) => tag.name) : []}

              onTagCreated={handleTagCreated}
            />
          </div>
        </div>
      </div>
    </>
  );
};



export default Community;