'use client'

import styles from 'app/electric-state/_components/Map.module.scss'
import { Map } from 'app/electric-state/_lib/type'
import { useState } from 'react'

export interface MapProps {
  maps: Map[]
}
export default function MapPage({ maps }: MapProps) {
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].title)
  const mapUrl = maps.find((m) => m.title === selectedMap)?.url || ''
  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      <div className="flex-0 mt-4">
        <div className="text-xl font-bold divide-x-4 flex flex-row">
          {maps.map((m, idx) => 
            <span key={m.title}>
              <h3 
                className={`inline mx-2 cursor-pointer transition-all duration-300 ease-in-out hover:opacity-70 ${selectedMap === m.title ? 'border-b-4' : ''}`}
                onClick={() => setSelectedMap(m.title)}>
                {m.title}
              </h3>
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center overflow-hidden relative w-full h-full">
        <div className="relative">
          {!!mapUrl && (
            <img 
              key={selectedMap}
              src={mapUrl} 
              alt={`Map of ${selectedMap}`} 
              className={`${styles.animateFadeIn} w-full h-full object-contain hover:scale-105 transition-transform duration-300`}
            />
          )}
        </div>
      </div>
    </div>
  )
}
