'use client'

import { useState } from 'react'
import { StoryChapter } from '../lib/type'

interface StoryProps {
  story: StoryChapter[]
}

export default function Story({ story }: StoryProps) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([])

  const toggleChapter = (index: number) => {
    setExpandedChapters(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div>
      {story.map((chapter, index) => (
        <div key={index} className="mb-6">
          <h2
            className="text-xl mb-3 font-semibold cursor-pointer flex items-center"
            onClick={() => toggleChapter(index)}
          >
            <span className="mr-2">{expandedChapters.includes(index) ? '▼' : '▶'}</span>
            {chapter.title}
          </h2>
          {expandedChapters.includes(index) && (
            <div className="mb-4">
              {chapter.story.split("\n").map((p) => <p key={p} className="mb-2">{p}</p>)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
