import { atom } from "recoil";

export const wsConnectedState = atom<boolean>({
  key: "wsConnectedState",
  default: false,
});