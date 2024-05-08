"use client";

import { useEffect } from "react";
import { userStore } from "./user.store";

const StoreHydrate = () => {
  useEffect(() => {
    userStore.persist.rehydrate();
  }, []);

  return null;
};

export default StoreHydrate;
