// src/state/authState.ts

import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

export interface User {
  id: string
  name: string
  email: string
}

const { persistAtom } = recoilPersist({
  key: 'auth-persist',
  storage: localStorage
})

export const currentUserAtom = atom<User | null>({
  key: 'currentUser',
  default: null,
  effects_UNSTABLE: [persistAtom]
})

export const authLoadingAtom = atom<boolean>({
  key: 'authLoading',
  default: false,
})
