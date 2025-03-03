"use client";

import { Button } from "@/components/ui/button";

export default function ScrollButton() {
  return (
    <div className="fixed bottom-8 right-8">
      <Button
        variant="outline"
        className="flex gap-2 items-center rounded-full p-3 text-sm translate-y-0 translate-x-0"
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
      >
        Scroll to bottom <ChevronDownIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {}

function ChevronDownIcon(props: ChevronDownIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
