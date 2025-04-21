
import { atom } from 'recoil';

import { Community, CustomFeed, Post, User ,  CommunityFormData } from '@/types';


export const communityModalState = atom({
  key: 'communityModalState',
  default: false,
});

export const communityFormState = atom<CommunityFormData>({
  key: 'communityFormState',
  default: {
    name: '',
    description: '',
    rules: ['Be respectful', 'Follow Reddit content policy'],
  },
});

export const currentUserState = atom<User | null>({
  key: 'currentUserState',
  default: null,
});

// User's joined communities
export const joinedCommunitiesState = atom<Community[]>({
  key: 'joinedCommunitiesState',
  default: [],
});

// Recently visited communities
export const recentCommunitiesState = atom<Community[]>({
  key: 'recentCommunitiesState',
  default: [],
});

export const customFeedsState = atom<CustomFeed[]>({
  key: 'customFeedsState',
  default: [],
});

// Feed posts
export const feedPostsState = atom<Post[]>({
  key: 'feedPostsState',
  default: [],
});

// Loading state for feed
export const feedLoadingState = atom<boolean>({
  key: 'feedLoadingState',
  default: false,
});

// Feed page number for infinite scrolling
export const feedPageState = atom<number>({
  key: 'feedPageState',
  default: 1,
});

// Sidebar collapsed state
export const sidebarCollapsedState = atom<boolean>({
  key: 'sidebarCollapsedState',
  default: false,
});

// Mock data for development
export const mockDataLoadedState = atom<boolean>({
  key: 'mockDataLoadedState',
  default: false,
});