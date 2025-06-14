import HecatePage from './HecatePage';
import { convertSessionIdToTitle } from './lib';

export async function generateStaticParams() {
  return [{ sessionId: 'wasteland-justice' }]
}

export async function generateMetadata({ params: { sessionId } }: { params: { sessionId: string } }) {
  return {
    title: convertSessionIdToTitle(sessionId),
  }
}

export default function Page({ params: { sessionId } }: { params: { sessionId: string }}) {
  return <HecatePage sessionId={sessionId} />;
}
