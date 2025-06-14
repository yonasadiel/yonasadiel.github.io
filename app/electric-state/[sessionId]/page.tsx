import { Metadata } from 'next';
import { Suspense } from 'react';
import HecateClientPage from './HecateClientPage';
import HecateServerPage from './HecateServerPage';
import { convertSessionIdToTitle } from './lib';

export async function generateStaticParams() {
  return [{ sessionId: 'wasteland-justice' }]
}

export async function generateMetadata({ params: { sessionId } }: { params: { sessionId: string } }): Promise<Metadata> {
  return {
    title: convertSessionIdToTitle(sessionId),
    description: 'Play Electric State RPG',
  }
}

export default function Page({ params: { sessionId } }: { params: { sessionId: string }}) {
  return (
    <>
      <Suspense fallback={<HecateServerPage sessionId={sessionId} travelerName={null} token={null} />}>
        <HecateClientPage sessionId={sessionId} />
      </Suspense>
    </>
  );
}
