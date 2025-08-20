'use client'

import styles from 'app/alien/_components/WelcomePage.module.scss'

interface WelcomePageProps {
  title: string
  playerName: string
  error?: string
  loading: boolean
  onStart?: () => void
}

export default function WelcomePage(props: WelcomePageProps) {
  const { title, playerName: crewName, error, loading, onStart } = props

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.innerBox}>
        <h1>// {title}</h1>
        <p>&gt; {crewName ? 'WAITING FOR COMMAND ...' : `WELCOME ABOARD, ${crewName}`}</p>
        {loading && <p className={styles.loading}>&gt; SYSTEM LOADING...</p>}
        {!loading && !!error && <small>&gt; ERROR: {error}</small>}
        {!loading && !error && !!onStart && (
          <button type="button" onClick={onStart}>
            INITIALIZE MISSION
          </button>
        )}
      </div>
    </div>
  )
}
