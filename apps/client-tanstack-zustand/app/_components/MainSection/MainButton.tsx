"use client";

import { useUserStore } from "@/contexts/userStore";
import ActionButton from "@ui/components/parts/ActionButton";
import { FC, useEffect } from "react";

interface Props {}
const MainButton: FC<Props> = ({}) => {
  const user = useUserStore();

  useEffect(() => {
    user.changeName({ name: "Jaekyeong" });
  }, []);

  return (
    <ActionButton className="bg-white text-black p-2">{user.name}</ActionButton>
  );
};

export default MainButton;
