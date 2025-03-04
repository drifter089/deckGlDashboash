import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center font-mono">
      <div className="text-5xl animate-pulse">loading...</div>
    </div>
  );
};

export default loading;
