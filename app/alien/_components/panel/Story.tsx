'use client'

import { StoryChapter } from 'app/electric-state/_lib/type'
import { useState } from 'react'

interface StoryProps {
  story: StoryChapter[]
}

export default function Story({ story }: StoryProps) {
  const [expandedChapter, setExpandedChapter] = useState<string>('')

  const toggleExpandedChapter = (title: string) => {
    setExpandedChapter(expandedChapter === title ? '' : title)
  }

  return (
    <div className="p-8 divide-y-4">
      {story.map((chapter) => (
        <div key={chapter.title} className="mb-4 border-black">
          <div>
            <h2
              className="text-xl mb-3 font-semibold cursor-pointer flex items-center transition-transform duration-1000"
              onClick={() => toggleExpandedChapter(chapter.title)}>
              <span className={`mr-2 w-4 transition-transform duration-300 ${expandedChapter === chapter.title ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              {chapter.title}
            </h2>
            <div 
              className={`overflow-hidden transition-all duration-1000 ease-in-out ${expandedChapter === chapter.title ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="mb-4">
                {chapter.story.split("\n").map((p) => <p key={p} className="mb-2">{p}</p>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
