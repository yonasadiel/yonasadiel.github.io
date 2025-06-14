'use client'

import { useState } from 'react'
import { StoryChapter } from '../lib/type'

interface StoryProps {
  story: StoryChapter[]
}

export default function Story({ story }: StoryProps) {
  const [expandedChapter, setExpandedChapter] = useState<string>('')

  const toggleExpandedChapter = (title: string) => {
    setExpandedChapter(expandedChapter === title ? '' : title)
  }

  return (
    <div className="p-8">
      {story.map((chapter) => (
        <div key={chapter.title} className="mb-6 divide-y border-black">
          <h2
            className="text-xl mb-3 font-semibold cursor-pointer flex items-center"
            onClick={() => toggleExpandedChapter(chapter.title)}>
            <span className="mr-2 w-4">{expandedChapter === chapter.title ? '▼' : '▶'}</span>
            {chapter.title}
          </h2>
          {expandedChapter === chapter.title && (
            <div className="mb-4">
              {chapter.story.split("\n").map((p) => <p key={p} className="mb-2">{p}</p>)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
