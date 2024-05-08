import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  id: number;
  name: string;
  age: number;
  setUserName: (payload: { name: string }) => void;
  setIncreaseAge: () => void;
}

const key = "user";
export const initialState = {
  id: 0,
  name: "",
  age: 0,
};

export const userStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUserName: (payload) => {
        const newName = payload.name;
        set({
          name: newName,
        });
      },
      setIncreaseAge: () => {
        set((state) => ({
          age: state.age + 1,
        }));
      },
    }),
    {
      name: `${key}.store`,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
