'use client'

import styles from 'app/electric-state/_components/Map.module.scss'
import { Map } from 'app/electric-state/_lib/type'
import { Fragment, useEffect, useRef, useState } from 'react'

export interface MapProps {
  maps: Map[]
  isDM: boolean
}

type Position = {
  x: number
  y: number
}

const poiColors = ['amber-500', 'blue-400']

export default function MapPage({ maps, isDM }: MapProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].title)
  const [position, setPosition] = useState<Position | null>(null)
  const [imageSize, setImageSize] = useState<Position | null>(null)
  const currentMap = maps.find((m) => m.title === selectedMap)

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.round(event.clientX - rect.left)
    const y = Math.round(event.clientY - rect.top)
    if (!!currentMap && x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      // swap x and y because the image is horizontal
      setPosition({
        x: Math.floor(y * currentMap.maxY / rect.width),
        y: Math.floor(x * currentMap.maxY / rect.width),
      })
    } else {
      setPosition(null)
    }
  }
  useEffect(() => {
    if (!!imageRef.current) {
      setImageSize({
        x: imageRef.current.width,
        y: imageRef.current.height,
      })
    }
  }, [imageRef?.current, imageRef?.current?.width])

  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      <div className="flex-0 mt-4 mb-4 text-xl font-bold divide-x-4 flex flex-row">
        {maps.map((m) => 
          <span key={m.title}>
            <h3 
              className={`inline mx-2 cursor-pointer transition-all duration-300 ease-in-out hover:opacity-70 ${selectedMap === m.title ? 'border-b-4' : ''}`}
              onClick={() => setSelectedMap(m.title)}>
              {m.title}
            </h3>
          </span>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center overflow-hidden relative w-full h-full">
        {!!currentMap && (
          <div className="relative h-full">    
            <img
              ref={imageRef}
              key={selectedMap}
              src={currentMap.url} 
              alt={`Map of ${selectedMap}`} 
              className={`${styles.animateFadeIn} w-full h-full object-contain transition-transform duration-300`}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setPosition(null)}
            />
            <div className="bg-amber-500 bg-blue-400" /> {/* to load all possible colors */}
            {!!imageSize?.x && (currentMap.pois ?? []).map((poi, idx) => (
              <Fragment key={poi.name}>
                <div key={poi.name} className={`absolute size-4 rounded-full shadow-sm shadow-black bg-${poiColors[idx]}`} style={{
                  top: (poi.x ?? 0) * imageSize.x / currentMap.maxY,
                  left: (poi.y ?? 0) * imageSize.x / currentMap.maxY,
                }} />
                <div key={poi.name} className={`absolute border-white px-1 text-xs rounded-sm shadow-sm shadow-black bg-${poiColors[idx]}`} style={{
                  top: (poi.x ?? 0) * imageSize.x / currentMap.maxY + 15,
                  left: (poi.y ?? 0) * imageSize.x / currentMap.maxY + 15,
                }}>{poi.name}</div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      {isDM && (<div className="flex-0 mt-4 mb-4 text-sm font-bold divide-x-4 flex flex-row">
        <span>x: {position?.x ?? '-'}, y: {position?.y ?? '-'}</span>
      </div>)}
    </div>
  )
}
