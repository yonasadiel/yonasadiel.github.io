import HecateClientPage from 'app/alien/[sessionId]/HecateClientPage';
import HecateServerPage from 'app/alien/[sessionId]/HecateServerPage';
import { convertSessionIdToTitle } from 'app/hecate/_lib/util';
import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateStaticParams() {
  return [{ sessionId: 'chariot-of-the-gods' }]
}

export async function generateMetadata({ params: { sessionId } }: { params: { sessionId: string } }): Promise<Metadata> {
  const title = convertSessionIdToTitle(sessionId)
  return {
    title: title,
    description: 'Play Alien RPG. Use this website as your character sheet, story tracker, and map viewer.',
    icons: '/assets/alien.ico',
    metadataBase: new URL('https://yonasadiel.com'),
    openGraph: {
      images: '/images/hecate/alien-cover.jpg'
    }
  }
}

export default function Page({ params: { sessionId } }: { params: { sessionId: string }}) {
  return (
    <>
      <Suspense fallback={<HecateServerPage sessionId={sessionId} />}>
        <HecateClientPage sessionId={sessionId} />
      </Suspense>
    </>
  );
}
