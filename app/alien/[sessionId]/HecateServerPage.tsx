'use client';

import styles from 'app/alien/[sessionId]/styles.module.scss';
import Book from 'app/alien/_components/panel/Panel';
import WelcomePage from 'app/alien/_components/WelcomePage';
import { useSessionData } from 'app/alien/_lib/hooks';
import FadeInImage from 'app/hecate/_components/Image';
import { convertSessionIdToTitle } from 'app/hecate/_lib/util';
import { Open_Sans } from 'next/font/google';
import { useState } from 'react';

interface HecatePageProps {
  sessionId: string
  playerName: string
  token: string
}

const openSans = Open_Sans({
  subsets: ['latin'],
})

function PlayerPage({ sessionId, playerName, token }: HecatePageProps) {
  const [showBook, setShowBook] = useState(false);

  const { sessionData, isLoading, error } = useSessionData({
    sessionId,
    playerName,
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
          playerName={playerName}
          error={error}
          loading={isLoading}
          onStart={() => setShowBook(true)} />
      </div>
      <div className={`${styles.bookWrapper} ${showBook ? styles.slideIn : ''}`}>
        {showBook && !isLoading && !!sessionData && <Book sessionId={sessionId} travelerName={playerName} sessionData={sessionData} />}
      </div>
    </div>
  );
}

function VisitorPage(props: Pick<Partial<HecatePageProps>, 'sessionId'>) {
  const { sessionId } = props;
  return (
    <div className={`${styles.hecate} ${openSans.className}`}>
      <div className={styles.welcomePage}>
        <WelcomePage
          title={convertSessionIdToTitle(sessionId || '') || 'Alien RPG'}
          playerName={'crew'}
          loading={false} />
      </div>
    </div>
  );
}

export default function HecateServerPage(props: Partial<HecatePageProps>) {
  const { sessionId, playerName, token } = props;
  return !!playerName && !!token && !!sessionId
      ? <PlayerPage sessionId={sessionId} playerName={playerName} token={token} />
      : <VisitorPage {...props} />
}
