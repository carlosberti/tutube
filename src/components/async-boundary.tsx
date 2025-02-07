"use client";

import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

export function AsyncBoundary({
  children,
  loadingFallback,
  errorFallback,
}: {
  children: React.ReactNode;
  loadingFallback: React.ReactNode;
  errorFallback: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
