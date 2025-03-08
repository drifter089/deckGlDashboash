import React from "react";

const GlobeLegend = () => {
  return (
    <div className="absolute border-border border bg-background top-4 right-4 hidden md:block w-[19rem] h-[10rem] p-2 rounded-lg">
      Hover a country and see the investment needed in
      <ul className="list-none">
        <li>
          <span className="inline-block w-3 h-3 bg-[hsl(45,100%,50%)] mx-1 rounded-sm" />{" "}
          Solar PV
        </li>
        <li>
          <span className="inline-block w-3 h-3 bg-[hsl(200,70%,70%)] border border-[hsl(200,70%,30%)] mx-1 rounded-sm" />{" "}
          Offshore Wind
        </li>
        <li>
          <span className="inline-block w-3 h-3 bg-[hsl(195,85%,75%)] border border-[hsl(195,85%,35%)] mx-1 rounded-sm" />{" "}
          Onshore Wind
        </li>
        <li>
          <span className="inline-block w-3 h-3 bg-[hsl(35,43%,53%)] border border-[hsl(35,43%,53%)] mx-1 rounded-sm" />{" "}
          Transmission Lines
        </li>
      </ul>
    </div>
  );
};

export default GlobeLegend;
