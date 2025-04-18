
import { atom } from 'recoil';

export interface CommunityFormData {
  name: string;
  description: string;
  rules: string[];
}

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
