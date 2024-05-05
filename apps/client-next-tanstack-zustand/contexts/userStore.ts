import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  id: number;
  name: string;
  age: number;
  changeName: (payload: { name: string }) => void;
  increaseAge: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: 0,
      name: "",
      age: 0,
      changeName: (payload) => {
        const newName = payload.name;
        set({
          name: newName,
        });
      },
      increaseAge: () => {
        set((state) => ({
          age: state.age + 1,
        }));
      },
    }),
    {
      name: "userStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
