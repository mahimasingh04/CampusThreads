// Define all types for the CampusThreads application

export interface CommunityFormData {
  name: string;
  description: string;
  rules: string[];
}

export interface User {
    id: string;
    username: string;
    avatarUrl: string;
  }
  
  export interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    createdAt: string;
    avatarUrl: string;
    bannerUrl?: string;
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
  }
  
  export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    upvoteCount: number;
    downvoteCount: number;
  }
  
  export interface CustomFeed {
    id: string;
    name: string;
    userId: string;
    communities: Community[];
  }