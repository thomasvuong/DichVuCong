import SearchForm from '../components/search-form';
import SearchResultsList from '../components/search-results-list';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <SearchForm initialQuery={query} />
      </div>

      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsList query={query} />
        </Suspense>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
