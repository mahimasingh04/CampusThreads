import { Community , CommunityRule, CommunitySummary, Rule,Tag, TagDetail, PostFormState, Post} from '@/types';
import { atom, selector, selectorFamily } from 'recoil';
import { fetchCommunities, fetchCommunityRules, fetchCommunityTags } from '@/api/Community';




export const selectedCommunityIdState = atom<string | null>({
  key: 'selectedCommunityIdState',
  default: null,
});

export const communitiesState = selector<CommunitySummary[]>({
     key: 'communitiesState',
  get: async () => {
    try {
      const response = await fetchCommunities(); 
      console.log('[DEBUG] Communities API response:', response);    //fetch all the communities 
      return response
    } catch (error) {
      console.error('Failed to fetch communities:', error);
      return [];
    }
  },
})

export const communityRulesState = selector<CommunityRule[]>({
  key: 'communityRulesState',
  get: async ({ get }) => {
    const communityId = get(selectedCommunityIdState);
    if (!communityId) return [];
    
    try {
      const response = await fetchCommunityRules(communityId);
      console.log("fetched rules: ",response)
      return response;
    } catch (error) {
      console.error('Failed to fetch community rules:', error);
      return [];
    }
  },
});

export const communityTagsState = selector<TagDetail[]>({
  key: 'communityTagsState',
  get: async ({ get }) => {
    const communityId = get(selectedCommunityIdState);
    if (!communityId) return [];
    
    try {
      const response = await fetchCommunityTags(communityId);
      return response;
    } catch (error) {
      console.error('Failed to fetch community tags:', error);
      return [];
    }
  },
});

export const selectedTagsState = atom<TagDetail[]>({
  key: 'selectedTagsState',
  default: [],
});

export const selectedCommunityState = selector<CommunitySummary| null >({
  key: 'selectedCommunityState',
  get: ({ get }) => {
    const communityId = get(selectedCommunityIdState);
    const communities = get(communitiesState);
    return communities.find(c => c.id === communityId) || null;
  },
});

export const postFormState = atom<PostFormState>({
  key: 'postFormState',
  default: {
    title: '',
    content: '',
    type: 'text',
    imageUrl: '',
    linkUrl: '',
    isSubmitting: false,
  },
});

export const tagAccessCodesState = atom<{
  [tagId: string]: {
    code: string;
    isValid?: boolean;
    isLoading?: boolean;
  };
}>({
  key: 'tagAccessCodesState',
  default: {},
});

export const privateTagsValidationState = selector({
  key: 'privateTagsValidationState',
  get: ({ get }) => {
    const selectedTags = get(selectedTagsState);
    const tagAccessCodes = get(tagAccessCodesState);
    const communityTags = get(communityTagsState);
    
    const privateTags = selectedTags.filter(tag => !tag.isPublic);
    
    return {
      allPrivateTagsValid: privateTags.every(tag => {
        return tagAccessCodes[tag.id]?.isValid === true;
      }),
      invalidPrivateTags: privateTags.filter(tag => {
        return tagAccessCodes[tag.id]?.isValid === false;
      }),
      pendingPrivateTags: privateTags.filter(tag => {
        const accessCode = tagAccessCodes[tag.id];
        return accessCode && accessCode.isValid === undefined;
      }),
    };
  },
});

export const postFormValidationState = selector({
  key: 'postFormValidationState',
  get: ({ get }) => {
    const form = get(postFormState);
    const communityId = get(selectedCommunityIdState);
    const { allPrivateTagsValid } = get(privateTagsValidationState);
    
    const hasTitle = form.title.trim().length > 0;
    const hasCommunity = !!communityId;
    
    return {
      isValid: hasTitle && hasCommunity && allPrivateTagsValid,
      hasTitle,
      hasCommunity,
      allPrivateTagsValid,
    };
  },
});

export const editPostState = atom<Post | undefined>({
  key: 'editPostState',
  default: undefined,
});

export const isEditingState = atom<boolean>({
  key: 'isEditingState',
  default: false,
});

 
