import { Button } from "@/components/ui/button";
import { Community } from "@/types";
import { useState, useEffect } from "react";
import { fetchCommunityById, joinCommunity, leaveCommunity } from "@/api/community";
import { useRecoilState } from "recoil";
import { currentUserState } from "@/store/Atom";
import { toast } from "sonner";

type CommunityHeaderProps = {
  communityId: string;
};

const CommunityHeader = ({ communityId }: CommunityHeaderProps) => {
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [user, setUser] = useRecoilState(currentUserState);

  // Fetch community data
  useEffect(() => {
    const loadCommunity = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCommunityById(communityId);
        setCommunity(data);
      } catch (error) {
        toast.error("Failed to load community data");
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunity();
  }, [communityId]);

  // Check if user is already a member
  const isMember = user?.joinedCommunities?.includes(communityId) || false;

  const toggleMembership = async () => {
    if (!user) {
      toast("Please sign in", {
        description: "You need to be signed in to join communities",
      });
      return;
    }

    try {
      setIsJoining(true);
      if (isMember) {
        await leaveCommunity(communityId);
        setUser(prev => ({
          ...prev!,
          joinedCommunities: prev?.joinedCommunities?.filter(id => id !== communityId) || []
        }));
        toast.success(`You've left ${community?.name}`);
      } else {
        await joinCommunity(communityId);
        setUser(prev => ({
          ...prev!,
          joinedCommunities: [...(prev?.joinedCommunities || []), communityId]
        }));
        toast.success(`You've joined ${community?.name}`);
      }
    } catch (error) {
      toast.error(`Failed to ${isMember ? 'leave' : 'join'} community`);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        {/* Loading skeleton */}
        <div className="h-32 md:h-48 w-full bg-slate-800 animate-pulse" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="h-24 w-24 rounded-full bg-slate-700 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return <div className="text-center py-10 text-slate-400">Community not found</div>;
  }

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden">
        {community.banner && (
          <img 
            src={community.banner} 
            alt={`${community.name} banner`}
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
        )}
      </div>

      {/* Community Info */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-white">
              {community.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="flex-1 min-w-0 mt-6 sm:mt-0">
              <h1 className="text-2xl font-bold text-white truncate">r/{community.name}</h1>
              <p className="text-slate-400 mt-1">{community.memberCount?.toLocaleString()} members</p>
              {community.description && (
                <p className="text-slate-300 mt-2 hidden sm:block">{community.description}</p>
              )}
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={toggleMembership}
                disabled={isJoining}
                className={`min-w-[100px] ${
                  isMember 
                    ? "bg-slate-800 hover:bg-slate-700" 
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isJoining ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isMember ? "Leaving..." : "Joining..."}
                  </span>
                ) : isMember ? "Joined" : "Join"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile description */}
        {community.description && (
          <p className="text-slate-300 mt-4 sm:hidden">{community.description}</p>
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;