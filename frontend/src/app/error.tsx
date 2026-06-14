'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>

        <button
          onClick={() => reset()}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}