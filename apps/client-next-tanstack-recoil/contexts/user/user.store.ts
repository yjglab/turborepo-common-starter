import { atom, selector } from "recoil";
import { persistAtom } from "../persist";

interface UserState {
  id: number;
  name: string;
  thumbnailUrl: string;
}

export const key = "user";
export const defaultState = {
  id: 0,
  name: "fff",
  thumbnailUrl: "",
};

export const userState = atom<UserState>({
  key,
  default: defaultState,
  effects_UNSTABLE: [persistAtom],
});

export const userReducer = {
  getUser: selector({
    key: `${key}.getUser`,
    get: ({ get }) => {
      return get(userState);
    },
  }),
  getUserName: selector({
    key: `${key}.getUserName`,
    get: ({ get }) => {
      return get(userState).name;
    },
  }),
};
