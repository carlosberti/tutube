"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AsyncBoundary } from "@/components/async-boundary";
import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";

type CategoriesSectionProps = {
  categoryId?: string;
};

function CategoriesSectionSuspense({ categoryId }: CategoriesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("categoryId", value);
    } else {
      params.delete("categoryId");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
}

function CategoriesSkeleton() {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
}

export function CategoriesSection(props: CategoriesSectionProps) {
  return (
    <AsyncBoundary
      loadingFallback={<CategoriesSkeleton />}
      errorFallback={
        <div role="alert" aria-live="polite">
          Failed to load categories
        </div>
      }
    >
      <CategoriesSectionSuspense {...props} />
    </AsyncBoundary>
  );
}
