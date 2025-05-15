
import { Button } from "@/components/ui/button";
import { Community } from "@/types";

import { useState } from "react";

type CommunityHeaderProps = {
  community: Community;
  
};

const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  const [joined, setJoined] = useState(false);

   if (!community) {
    return (
      <div className="relative h-48 w-full bg-slate-800 animate-pulse">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="h-24 w-24 rounded-full bg-slate-700 border-4 border-slate-900"></div>
          </div>
        </div>
      </div>
    );
  }


  const bannerImage = community.banner || ''; 
  const displayName = community.name || '';

  
  const toggleJoin = () => {
    setJoined(!joined);
  };

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden">
        {community.banner && (
          <img 
            src={bannerImage} 
            alt={`${displayName} banner`}
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
              {displayName.charAt(0)}
            </div>
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="flex-1 min-w-0 mt-6 sm:mt-0">
              <h1 className="text-2xl font-bold text-white truncate">r/{displayName}</h1>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={toggleJoin} 
                className={joined ? "bg-slate-800 hover:bg-slate-700" : "bg-orange-500 hover:bg-orange-600"}
              >
                {joined ? "Joined" : "Join"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
