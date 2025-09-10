'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchServices } from '@/app/lib/actions';
import type { Service } from '@/app/lib/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function SearchResultsList({ query }: { query: string }) {
  const [results, setResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchServices(query)
        .then((data) => {
          setResults(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <SearchResultsSkeleton />;
  }

  if (!query) {
    return null;
  }
  
  return (
    <div>
        <p className="text-sm text-muted-foreground mb-4">
            {results.length > 0
            ? `Hiển thị ${results.length} kết quả cho "${query}"`
            : `Không tìm thấy kết quả phù hợp nào cho "${query}".`}
        </p>

        {results.length > 0 && (
            <div className="space-y-4">
            {results.map((result) => (
                <Link href={result.link} key={result.id}>
                    <Card className="p-4 hover:bg-secondary/50 transition-colors">
                        <h3 className="text-lg font-semibold text-primary hover:underline">{result.title}</h3>
                        <p className="text-muted-foreground mt-1">{result.description}</p>
                    </Card>
                </Link>
            ))}
            </div>
        )}
    </div>
  );
}
