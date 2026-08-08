"use client";

import ErrorBoundary from "@/components/ErrorBoundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body className="bg-[#050508] text-white min-h-screen">
        <ErrorBoundary error={error} reset={reset} />
      </body>
    </html>
  );
}
