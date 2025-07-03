'use client';

import styles from 'app/electric-state/[sessionId]/styles.module.scss';
import Book from 'app/electric-state/_components/book/Book';
import FadeInImage from 'app/electric-state/_components/Image';
import WelcomePage from 'app/electric-state/_components/WelcomePage';
import { convertSessionIdToTitle } from 'app/electric-state/_lib';
import { useSessionData } from 'app/electric-state/_lib/hooks';
import { Open_Sans } from 'next/font/google';
import { useState } from 'react';

interface HecatePageProps {
  sessionId: string
  travelerName: string | null
  token: string | null
}

const openSans = Open_Sans({
  subsets: ['latin'],
})

export default function HecateServerPage({ sessionId, travelerName, token }: HecatePageProps) {
  const [showBook, setShowBook] = useState(false);
  const { sessionData, isLoading, error } = useSessionData({
    sessionId,
    travelerName,
    token,
  });

  return (
    <div className={`${styles.hecate} ${openSans.className}`}>
      <div className={styles.backgroundImage}>
        {!!sessionData?.backgroundImage && <FadeInImage className="w-full h-full object-cover" alt="background art" src={sessionData.backgroundImage} />}
      </div>
      <div className={`${styles.welcomePage} ${showBook ? styles.fadeOut : ''}`}>
        <WelcomePage
          title={convertSessionIdToTitle(sessionId)}
          travelerName={travelerName || 'traveler'}
          error={error}
          loading={isLoading}
          onStart={() => setShowBook(true)} />
      </div>
      <div className={`${styles.bookWrapper} ${showBook ? styles.slideIn : ''}`}>
        {showBook && !isLoading && !!sessionData && <Book sessionId={sessionId} travelerName={travelerName || ''} sessionData={sessionData} />}
      </div>
    </div>
  );
}
