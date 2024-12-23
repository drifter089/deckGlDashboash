import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div>
      <Skeleton className="w-full h-full"></Skeleton>
    </div>
  );
};

export default loading;
