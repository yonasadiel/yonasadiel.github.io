'use client'

import { useState } from 'react'
import { Map } from '../lib/type'

export interface MapProps {
  maps: Map[]
}
export default function MapPage({ maps }: MapProps) {
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].title)
  const mapUrl = maps.find((m) => m.title === selectedMap)?.url || ''
  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      <div className="flex-0 mt-4">
        <h3 className="text-xl font-bold divide-x-4">
          {maps.map((m, idx) => 
            <span key={m.title}>
              {idx !== 0 && (<span className="border-b-4"></span>)}
              <span className={`mx-2 ${selectedMap === m.title ? 'border-b-4' : ''} `} onClick={() => setSelectedMap(m.title)}>{m.title}</span>
            </span>
          )}
        </h3>
      </div>
      <div className="flex-1 flex justify-center items-center">
        {!!mapUrl && (<img src={mapUrl} alt={`Map of ${selectedMap}`} />)}
      </div>
    </div>
  )
}
