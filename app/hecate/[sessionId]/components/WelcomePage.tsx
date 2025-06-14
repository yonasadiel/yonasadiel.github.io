'use client'

import styles from './WelcomePage.module.scss'

interface WelcomePageProps {
  title: string
  travelerName: string
  error: string
  loading: boolean
  onStart: () => void
}

export default function WelcomePage(props: WelcomePageProps) {
  const { title, travelerName, error, loading, onStart } = props

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.innerBox}>
        <h1>{title}</h1>
        <p>Welcome, {travelerName || 'traveler'}.</p>
        {loading && <p>Loading...</p>}
        {!loading && error && <small>{error}</small>}
        {!loading && !error && (<button type="button" onClick={onStart}>
          Resume your journey
        </button>)}
      </div>
    </div>
  )
}
