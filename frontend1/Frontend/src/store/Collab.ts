// state.ts
import { atom } from 'recoil';
import { Post } from '@/types';

export const postsAtom = atom<Post[]>({
  key: 'postsAtom',
  default: [],
});

export const websocketAtom = atom<WebSocket | null>({
  key: 'websocketAtom',
  default: null,
});


