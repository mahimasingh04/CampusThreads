import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState ,useRecoilValue} from "recoil";
import { fetchCommunities } from "@/api/Community";
import { selectedCommunityIdState, communitiesState } from "@/store/PostForm";
import { userJoinedCommunitiesState } from "@/store/CommunityState";
import { CommunitySummary } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/Loading";



const CommunitySelection = () => {
    const [selectedCommunityId, setSelectedCommunityId] = useRecoilState(selectedCommunityIdState);
      const communities = useRecoilValue(communitiesState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joinedCommunities, setJoinedCommunities] = useRecoilState(userJoinedCommunitiesState);
 



}