import { Suspense } from 'react';
import ResultsClient from '@/components/ResultsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading your results…</div>}>
      <ResultsClient />
    </Suspense>
  );
}
