import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Button className="w-full sm:w-auto font-semibold text-lg py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
