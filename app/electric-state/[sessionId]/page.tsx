import HecateClientPage from 'app/electric-state/[sessionId]/HecateClientPage';
import HecateServerPage from 'app/electric-state/[sessionId]/HecateServerPage';
import { convertSessionIdToTitle } from 'app/electric-state/_lib';
import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateStaticParams() {
  return [{ sessionId: 'wasteland-justice' }]
}

export async function generateMetadata({ params: { sessionId } }: { params: { sessionId: string } }): Promise<Metadata> {
  const title = convertSessionIdToTitle(sessionId)
  return {
    title: title,
    description: 'Play Electric State RPG',
    icons: '/assets/electric-state.ico',
    metadataBase: new URL('https://yonasadiel.com'),
    openGraph: {
      images: '/images/hecate/sentre.jpg'
    }
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
