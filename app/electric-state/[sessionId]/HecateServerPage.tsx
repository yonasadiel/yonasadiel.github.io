'use client';

import styles from 'app/electric-state/[sessionId]/styles.module.scss';
import Book from 'app/electric-state/_components/book/Book';
import FadeInImage from 'app/electric-state/_components/Image';
import WelcomePage from 'app/electric-state/_components/WelcomePage';
import { convertSessionIdToTitle } from 'app/electric-state/_lib';
import { useGetSessionDataQuery } from 'app/electric-state/_lib/sessionApi';
import { SessionData } from 'app/electric-state/_lib/type';
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
  const {
    data: sessionData,
    isLoading,
    error
  } = useGetSessionDataQuery(
    { sessionId, travelerName: travelerName || '', token: token || '' },
    { skip: !travelerName || !token }
  );

  const errorMessage = !travelerName || !token
    ? 'This is a page to play Electric State RPG.'
    : error
    ? 'Failed fetching session data.'
    : '';

  return (
    <div className={`${styles.hecate} ${openSans.className}`}>
      <div className={styles.backgroundImage}>
        {!!sessionData?.backgroundImage && <FadeInImage className="w-full h-full object-cover" alt="background art" src={sessionData.backgroundImage} />}
      </div>
      <div className={`${styles.welcomePage} ${showBook ? styles.fadeOut : ''}`}>
        <WelcomePage
          title={convertSessionIdToTitle(sessionId)}
          travelerName={travelerName || 'traveler'}
          error={errorMessage}
          loading={isLoading}
          onStart={() => setShowBook(true)} />
      </div>
      <div className={`${styles.bookWrapper} ${showBook ? styles.slideIn : ''}`}>
        {showBook && !isLoading && !!sessionData && <Book sessionId={sessionId} travelerName={travelerName || ''} sessionData={sessionData} />}
      </div>
    </div>
  );
}
