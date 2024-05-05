import { atom } from "recoil";
import { selector } from "recoil";

interface UserState {
  id: number;
  name: string;
  thumbnailUrl: string;
}

export const userState = atom<UserState>({
  key: "userState",
  default: {
    id: 0,
    name: "",
    thumbnailUrl: "",
  },
});

const RunGetUserId = selector({
  key: "RunGetUserId",
  get: ({ get }) => {
    const user = get(userState);
    return user.id;
  },
});
