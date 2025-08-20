'use client';

import HecateServerPage from 'app/alien/[sessionId]/HecateServerPage';
import { useSearchParams } from 'next/navigation';

interface HecatePageProps {
  sessionId: string;
}

export default function HecateClientPage({ sessionId }: HecatePageProps) {
  const searchParams = useSearchParams();
  const playerName = searchParams.get('name');
  const token = searchParams.get('token');

  return (
    <HecateServerPage sessionId={sessionId} playerName={playerName || undefined} token={token || undefined} />
  );
}
