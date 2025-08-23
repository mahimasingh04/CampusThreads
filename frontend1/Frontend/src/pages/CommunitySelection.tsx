import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState,useRecoilValue} from "recoil";

import {   allCommunitiesState} from "@/store/PostForm";
import { userJoinedCommunitiesState } from "@/store/CommunityState";

import { Button } from "@/components/ui/button";


import { currentUserState } from "@/store/Atom";
import { fetchCommunities, joinCommunity, leaveCommunity } from "@/api/Community";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";



const CommunitySelection = () => {
   const currentUser = useRecoilValue(currentUserState);
    
      const [availableCommunities, setAvailableCommunities] = useRecoilState(allCommunitiesState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const joinedCommunities = useRecoilValue(userJoinedCommunitiesState);

     

    useEffect(() => {

     const loadData = async () => {
      // Ensure the user is authenticated before fetching their communities
      if (!currentUser?.id) {
        setLoading(false);
        return; 
      }
    
  try {
      setLoading(true);
        const allComms = await fetchCommunities();
        setAvailableCommunities(allComms);
  }catch(error: any) {
     console.error("Error loading communities:", error);
        toast.error(error.message || "Failed to load communities");
  } finally{
    setLoading(false);
  }
     }
  loadData();
  }, [currentUser?.id, setAvailableCommunities])

   const handleToggleCommunity = async (communityId: string) => {
    const isJoined = joinedCommunities.includes(communityId);
    
    try {
      if (isJoined) {
        await leaveCommunity(communityId);
        toast.success("Left the community");
      } else {
        await joinCommunity(communityId);
        toast.success("Joined the community");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update community membership");
    }
  };


  const handleContinue = () =>{
    if (joinedCommunities.length === 0) {
      toast.warning("Please join at least one community to continue");
      return;
    }
    navigate("/");
  };
  
    if(loading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )
    }


    return (
      <div className="min-h-screen bg-slate-900 text-white">

        <div className="container mx-auto py-8 px-4 sm: px-6 lg:px-8 max-w-6xl">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to CampusTHREADS</h1>
            <p className="text-gray-400">Join communities that interest you to get started</p>
            <p className="text-slate-400 text-sm">
            You can always join or leave communities later
          </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {availableCommunities.map((community) => {
              const isJoined =joinedCommunities.includes(community.id);

              return (
                <Card 
                key={community.id}
                className ={`cursor-pointer trnsition-all duration-200 hover:scale-105 border-2 ${isJoined ? 'border-orange-500 bg-slate-800' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                onClick ={() => handleToggleCommunity(community.id)}
                >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-lg font-bold">
                        {community.name.charAt(0)}
                      </div>
                      {isJoined && (
                        <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                   <CardTitle className="text-lg text-white">
                    r/{community.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-slate-400 text-sm mb-4 line-clamp-3">
                    {community.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                      <Users className="h-3 w-3 mr-1" />
                      {community.memberCount.toLocaleString()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {3}%
                    </Badge>
                  </div>
                  
                  (
                    <Badge className="text-xs bg-green-600 hover:bg-green-700">
                      Public
                    </Badge>
                  )
                </CardContent>

                </Card>
              )
            })}
          </div>

            <div className="text-center">
          <div className="mb-4">
            <p className="text-slate-400">
              {joinedCommunities.length} communit{joinedCommunities.length === 1 ? 'y' : 'ies'} selected
            </p>
          </div>

          <Button
            onClick={handleContinue}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
            disabled={joinedCommunities.length === 0}
          >
            Continue to Feed
          </Button>
        </div>
      </div>

      </div>
    )
  };

export default CommunitySelection;

