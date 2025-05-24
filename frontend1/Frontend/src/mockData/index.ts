
import { Community, CustomFeed, Post, User , CommnityIconProps} from '@/types';

// Mock user
export const mockUser: User = {
  id: 'user-1',
  username: 'campususer',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1',
};

export const currentUser: User = {
  id: "1",
  username: "john_doe",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
 
};

// Mock communities
export const mockCommunities: Community[] = [
  {
    id: 'community-1',
    name: 'ComputerScience',
    description: 'A community for computer science students and enthusiasts',
    memberCount: 12500,
    createdAt: '2022-01-15T00:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/cs/100',
  },
  {
    id: 'community-2',
    name: 'Engineering',
    description: 'For all types of engineering discussions',
    memberCount: 8700,
    createdAt: '2022-02-20T00:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/eng/100',
  },
  {
    id: 'community-3',
    name: 'Calculus',
    description: 'Calculus problems and solutions',
    memberCount: 5200,
    createdAt: '2022-03-10T00:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/calc/100',
  },
  {
    id: 'community-4',
    name: 'Physics',
    description: 'Discuss physics concepts and problems',
    memberCount: 6300,
    createdAt: '2022-03-15T00:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/phys/100',
  },
  {
    id: 'community-5',
    name: 'CampusEvents',
    description: 'Stay updated with events around campus',
    memberCount: 15800,
    createdAt: '2022-01-05T00:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/events/100',
  },
];

// Mock recently visited communities
export const mockRecentCommunities: Community[] = [
  mockCommunities[0],
  mockCommunities[4],
  mockCommunities[2],
];

// Mock custom feeds
export const mockCustomFeeds: CustomFeed[] = [
  {
    id: 'feed-1',
    name: 'STEM Topics',
    userId: 'user-1',
    communities: [mockCommunities[0], mockCommunities[2], mockCommunities[3]],
  },
  {
    id: 'feed-2',
    name: 'Campus Life',
    userId: 'user-1',
    communities: [mockCommunities[4], mockCommunities[1]],
  },
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Interesting discovery in quantum computing',
    summary: 'A brief overview of the latest breakthrough in quantum computing and what it means for the future of technology',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    communityId: 'community-1',
    communityName: 'ComputerScience',
    authorId: 'author-1',
    authorName: 'quantum_enthusiast',
    authorAvatarUrl: 'https://avatars.githubusercontent.com/u/2',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:30:00Z',
    upvoteCount: 142,
    downvoteCount: 12,
    commentCount: 37,
    imageUrl: 'https://picsum.photos/seed/quantum/800/500',
  },
  {
    id: 'post-2',
    title: 'Guide to surviving final exams',
    summary: 'Tips and tricks for managing stress and studying effectively during final exam season',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    communityId: 'community-5',
    communityName: 'CampusEvents',
    authorId: 'author-2',
    authorName: 'study_master',
    authorAvatarUrl: 'https://avatars.githubusercontent.com/u/3',
    createdAt: '2023-04-14T15:45:00Z',
    updatedAt: '2023-04-14T16:20:00Z',
    upvoteCount: 278,
    downvoteCount: 5,
    commentCount: 52,
  },
  {
    id: 'post-3',
    title: 'New calculus approach that simplifies integration',
    summary: 'A professor at MIT has developed a new approach to teaching integration that many students find more intuitive',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    communityId: 'community-3',
    communityName: 'Calculus',
    authorId: 'author-3',
    authorName: 'math_wizard',
    authorAvatarUrl: 'https://avatars.githubusercontent.com/u/4',
    createdAt: '2023-04-13T09:15:00Z',
    updatedAt: '2023-04-13T09:15:00Z',
    upvoteCount: 89,
    downvoteCount: 21,
    commentCount: 15,
    imageUrl: 'https://picsum.photos/seed/calculus/800/500',
  },
  {
    id: 'post-4',
    title: 'Campus construction to affect north entrance',
    summary: 'Starting next week, construction will begin on the north entrance. Here are the alternate routes you can take.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    communityId: 'community-5',
    communityName: 'CampusEvents',
    authorId: 'author-4',
    authorName: 'campus_news',
    authorAvatarUrl: 'https://avatars.githubusercontent.com/u/5',
    createdAt: '2023-04-12T14:30:00Z',
    updatedAt: '2023-04-12T14:30:00Z',
    upvoteCount: 56,
    downvoteCount: 8,
    commentCount: 23,
    imageUrl: 'https://picsum.photos/seed/construction/800/500',
  },
  {
    id: 'post-5',
    title: 'Free tutoring sessions available for engineering students',
    summary: 'The engineering department is offering free tutoring sessions for all engineering courses. Sign up now!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    communityId: 'community-2',
    communityName: 'Engineering',
    authorId: 'author-5',
    authorName: 'eng_helper',
    authorAvatarUrl: 'https://avatars.githubusercontent.com/u/6',
    createdAt: '2023-04-11T11:20:00Z',
    updatedAt: '2023-04-11T11:20:00Z',
    upvoteCount: 112,
    downvoteCount: 3,
    commentCount: 18,
  },
];

// Function to initialize mock data
export const initializeMockData = () => {
  return {
    user: mockUser,
    communities: mockCommunities,
    recentCommunities: mockRecentCommunities,
    customFeeds: mockCustomFeeds,
    posts: mockPosts,
  };
};
