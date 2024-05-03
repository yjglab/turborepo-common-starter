"use client";

import * as React from "react";
import { useUserStore } from "./userStore";

const StoreHydration = () => {
  React.useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  return null;
};

export default StoreHydration;
