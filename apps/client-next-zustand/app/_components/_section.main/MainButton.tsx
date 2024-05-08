"use client";

import { userStore } from "@/contexts/user.store";
import ActionButton from "@ui/components/parts/ActionButton";
import { FC, useEffect } from "react";

interface Props {}
const MainButton: FC<Props> = () => {
  const user = userStore();

  useEffect(() => {
    user.setUserName({ name: "Jaekyeong" });
  }, []);

  return (
    <ActionButton className="bg-white text-black p-2">{user.name}</ActionButton>
  );
};

export default MainButton;
