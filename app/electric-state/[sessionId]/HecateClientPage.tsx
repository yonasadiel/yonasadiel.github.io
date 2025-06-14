'use client';

import { useSearchParams } from 'next/navigation';
import HecateServerPage from './HecateServerPage';

interface HecatePageProps {
  sessionId: string;
}

export default function HecateClientPage({ sessionId }: HecatePageProps) {
  const searchParams = useSearchParams();
  const travelerName = searchParams.get('name');
  const token = searchParams.get('token');

  return (
    <HecateServerPage sessionId={sessionId} travelerName={travelerName} token={token} />
  );
}
