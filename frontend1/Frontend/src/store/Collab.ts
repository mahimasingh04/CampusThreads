import { atom, selectorFamily } from "recoil";
import { CollaborationDetails, CollaborationApplicants } from "@/types";

export const collabPostsState = atom<Record<string, CollaborationDetails>>({
  key: "collabPostsState",
  default: {},
});


export const collabRequestsState = atom<Record<string, CollaborationApplicants[]>>({
  key: "collabRequestsState",
  default: {},
});


export const collabPostSelector = selectorFamily<CollaborationDetails| undefined, string>({
  key: "collabPostSelector",
  get:
    (postId: string) =>
    ({ get }) => {
      return get(collabPostsState)[postId];
    },
});