import { notFound } from 'next/navigation';
import { getProcedureDetails } from '@/app/lib/actions';
import ProcedureDetailClient from '@/app/components/procedure-detail-client';

export const dynamic = 'force-dynamic';

export default async function ProcedureDetailPage({ params }: { params: { id: string } }) {
  const procedure = await getProcedureDetails(params.id);

  if (!procedure) {
    notFound();
  }

  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <ProcedureDetailClient procedure={procedure} />
        </div>
    </div>
  );
}
