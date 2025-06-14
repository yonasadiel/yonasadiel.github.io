'use client';

import { Open_Sans } from 'next/font/google';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Book from './components/Book';
import WelcomePage from './components/WelcomePage';
import { convertSessionIdToTitle } from './lib';
import { getSessionData } from './lib/api';
import { SessionData } from './lib/type';
import styles from './styles.module.scss';

interface HecatePageProps {
  sessionId: string;
}

const openSans = Open_Sans({
  subsets: ['latin'],
})

export default function HecatePage({ sessionId }: HecatePageProps) {
  const [showBook, setShowBook] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const travelerName = searchParams.get('name');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!travelerName || !token) {
      setError('This is a page to play Electric State RPG.')
      setLoading(false)
      return
    }
    getSessionData(sessionId, travelerName || '', token || '')
      .then(data => {
        if (!('title' in data)) {
          setError('Failed fetching session data.')
          setLoading(false)
          return
        }
        setSessionData(data)
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [sessionId, travelerName, token]);

  return (
    <div className={`${styles.hecate} ${openSans.className}`}>
      <div className={styles.backgroundImage} style={{ opacity: loading ? 0 : 1,backgroundImage: `url(${sessionData?.backgroundImage})` }} />
      <div className={`${styles.welcomePage} ${showBook ? styles.fadeOut : ''}`}>
        <WelcomePage
          title={convertSessionIdToTitle(sessionId)}
          travelerName={travelerName || 'traveler'}
          error={error}
          loading={loading}
          onStart={() => setShowBook(true)} />
      </div>
      <div className={`${styles.bookWrapper} ${showBook ? styles.slideIn : ''}`}>
        {showBook && !loading && !!sessionData && <Book sessionId={sessionId} travelerName={travelerName || ''} sessionData={sessionData} />}
      </div>
    </div>
  );
}
