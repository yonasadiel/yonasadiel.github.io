'use client'

import styles from 'app/electric-state/_components/Book.module.scss'
import Map from 'app/electric-state/_components/Map'
import Story from 'app/electric-state/_components/Story'
import Travelers from 'app/electric-state/_components/Travelers'
import { SessionData } from 'app/electric-state/_lib/type'
import { useState } from 'react'

interface BookProps {
  sessionId: string
  travelerName: string
  sessionData: SessionData
}

const BOOKMARK_STORY = 'Story'
const BOOKMARK_TRAVELERS = 'Travelers'
const BOOKMARK_MAP = 'Map'

const BOOKMARKS = [
  BOOKMARK_STORY,
  BOOKMARK_TRAVELERS,
  BOOKMARK_MAP,
]

export default function Book(props: BookProps) {
  const { sessionId, travelerName, sessionData } = props

  const [activeBookmark, setActiveBookmark] = useState(BOOKMARK_STORY)


  const renderContent = () => {
    switch (activeBookmark) {
      case BOOKMARK_STORY:
        return <Story story={sessionData.story} />
      case BOOKMARK_TRAVELERS:
        return <Travelers travelerName={travelerName} travelers={sessionData.travelers} />
      case BOOKMARK_MAP:
        return <Map maps={sessionData.maps} />
      default:
        return null
    }
  }

  return (
    <div className={styles.book}>
      <div className={styles.content}>
        <div className={styles.page}>
          {renderContent()}
        </div>
        <div className={`${styles.page} ${styles.other1}`} />
        <div className={`${styles.page} ${styles.other2}`} />
      </div>
      <div className={styles.bookmarks}>
        {BOOKMARKS.map((b) => (
          <div
            key={b}
            className={`${styles.bookmark} ${activeBookmark === b ? styles.active : ''}`}
            onClick={() => setActiveBookmark(b)}>
            {b}
          </div>
        ))}
      </div>
    </div>
  )
}
