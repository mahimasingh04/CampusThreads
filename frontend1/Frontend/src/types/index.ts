// Define all types for the CampusThreads application

export interface CommunityFormData {
  name: string;
  description: string;
  rules: string[];
}

export interface BasicCommunity {
  id: string;
  name: string;
  description: string;
  banner : string;
}

export interface User {
    id: string;
    username: string;
    avatarUrl: string;
    role?: 'member' | 'moderator' | 'admin';
    joinedCommunities?: string[]; 
  }
  
  export interface Community {
    id: string;
    name: string;
    description: string;
    banner : string;
    membersCount? : number;
    createdAt: string;
    avatarUrl: string;
    bannerUrl?: string;
    posts : Post[];
    rules? : Rule[];
    tags ? : Tag[];
    moderators: Moderator[];
    
  }
  
  export interface Post {
    id: string;
    title: string;
    summary: string;
    content: string;
    communityId: string;
    communityName: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    createdAt: string;
    updatedAt: string;
    upvoteCount: number;
    downvoteCount: number;
    commentCount: number;
    imageUrl?: string;
    tags: Tag[];
    isPrivate?: boolean;
   accessCode?: string | null;
    isCollaboration?: boolean;
    collaborationDetails?: CollaborationDetails
  }
  
  export interface Comment {
    id: string;
    postId: string;
    postTitle : string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    content: string;
    commentCount: number;
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
    upvoteCount: number;
    downvoteCount: number;
    
  }

  export interface Rules {
    id: string;
    order: number;
    communityId : string;
    title : string;
    description: string;


  }
  export interface RulesForm {
    id: string;
    title : string;
    description : string,
    order: number
  }
  export interface CustomFeed {
    id: string;
    name: string;
    userId: string;
    communities: Community[];
  }

  export type Tag = {
    id: string;
    name: string;
    description: string;
    communityId: string;
    isPublic: boolean;
    accessCode?: string;
  };

  export type SortOption = "newest" | "hottest" | "oldest";

export type NestedComment = Comment & {
  replies?: NestedComment[];
  parentId?: string;
};

export type CollaborationDetails = {
  eventName: string;
  eventDate: string;
  location: string;
  eventLink: string;
  description: string;
  rolesNeeded: string[];
  totalSpots: number;
  filledSpots: number;
  applicants: User[];
};

export type CollaborationRole = {
  id: string;
  name: string;
};

  export type Rule = {
    id: string;
    order: number;
    title: string;
    description?: string;
    communityId: string;
  };


  export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
 export interface HackathonPost extends Post {
  teamMembers: User[];
  requiredSkills: string[];
  eventDate: string;
  location: string;
  teamSize: number;
  currentMembers: number;
}

export interface Moderator {
  id: string,
  avatar : string,
  name: string,
  avatarUrl? : string
  communityId: string

}

export interface CommnityIconProps {
    id : string;
    name: string;
    description: string;
    rules : Rule[];
    membersCount: number;
    createdAt : string;
}

export interface CommunitySummary {
  id: string;
  name: string;
  image:string | null,
  description: string | null;
  memberCount: number;
  rules: Rule[];
  tags: Tag[];
  createdAt: string | Date;
}

export interface TagDetail {
    id : string,
    name: string,
    description: string,
    isPublic: boolean

}
export interface CommunityRule {
    order: number;
  title: string;
  description: string | null;
}

export interface PostFormState {
  title: string;
  content: string;
  type: 'text' | 'image' | 'link'; // assuming these are the possible types
  imageUrl: string;
  linkUrl: string;
  isSubmitting: boolean;
}