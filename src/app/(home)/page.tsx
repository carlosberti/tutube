import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient, trpc } from "@/trpc/server";

import PageClient from "./client";

export default async function Home() {
  void trpc.hello.prefetch({ text: "from tRPC" });

  return (
    <HydrateClient>
      <Suspense fallback={<p>loading...</p>}>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
