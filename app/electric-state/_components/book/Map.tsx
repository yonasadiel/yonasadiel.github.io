'use client'

import styles from 'app/electric-state/_components/book/Map.module.scss'
import { Map } from 'app/electric-state/_lib/type'
import { useEffect, useRef, useState } from 'react'
import FadeInImage from '../Image'

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
  const imgRef = useRef<HTMLImageElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].title)
  const [mousePos, setMousePos] = useState<Position | null>(null)
  const [imageOffset, setImageOffset] = useState<Position | null>(null)
  const [imageSize, setImageSize] = useState<Position | null>(null)
  const currentMap = maps.find((m) => m.title === selectedMap)

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.round(event.clientX - rect.left)
    const y = Math.round(event.clientY - rect.top)
    if (!!currentMap && x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      // swap x and y because the image is horizontal
      setMousePos({
        x: Math.floor(y * currentMap.maxY / rect.width),
        y: Math.floor(x * currentMap.maxY / rect.width),
      })
    } else {
      setMousePos(null)
    }
  }
  useEffect(() => {
    if (!imgRef?.current) return
    if (!imgContainerRef?.current) return

    const updateImageSize = () => {
      const imgRect = imgRef.current?.getBoundingClientRect()
      const imgContainerRect = imgContainerRef.current?.getBoundingClientRect()
      if (imgRect && imgContainerRect) {
        setImageSize({ x: imgRect.width, y: imgRect.height })
        setImageOffset({ x: imgRect.left - imgContainerRect.left, y: imgRect.top - imgContainerRect.top })
      }
    }

    updateImageSize()
    const resizeObserver = new ResizeObserver(updateImageSize)
    resizeObserver.observe(imgContainerRef.current)

    return () => resizeObserver.disconnect()
  }, [imgRef?.current, imgContainerRef?.current])

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
      <div ref={imgContainerRef} className="flex-1 flex justify-center items-center overflow-hidden relative w-full h-full">
        {!!currentMap && (
          <FadeInImage
            imgRef={imgRef}
            src={currentMap.url} 
            alt={`Map of ${selectedMap}`} 
            className={`${styles.animateFadeIn} max-w-full max-h-full object-contain transition-transform duration-300`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
          />
        )}
        <div className="bg-amber-500 bg-blue-400" /> {/* to load all possible colors */}
        {!!currentMap && !!imageSize?.x && (currentMap.pois ?? []).map((poi, idx) => (
          <div key={poi.name}>
            <div className={`absolute size-2 rounded-full shadow-sm shadow-black bg-${poiColors[idx]}`} style={{
              top: (poi.x ?? 0) * imageSize.x / currentMap.maxY + (imageOffset?.y ?? 0),
              left: (poi.y ?? 0) * imageSize.x / currentMap.maxY + (imageOffset?.x ?? 0),
            }} />
            <div className={`absolute border-white px-1 text-xs rounded-sm shadow-sm shadow-black bg-${poiColors[idx]}`} style={{
              top: (poi.x ?? 0) * imageSize.x / currentMap.maxY + (imageOffset?.y ?? 0) + 15,
              left: (poi.y ?? 0) * imageSize.x / currentMap.maxY + (imageOffset?.x ?? 0) + 15,
            }}>{poi.name}</div>
          </div>
        ))}
      </div>
      {isDM && (<div className="flex-0 mt-4 mb-4 text-sm font-bold divide-x-4 flex flex-row">
        <span>x: {mousePos?.x ?? '-'}, y: {mousePos?.y ?? '-'}</span>
      </div>)}
    </div>
  )
}
