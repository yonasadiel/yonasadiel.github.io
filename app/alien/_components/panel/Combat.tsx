'use client'

import { Combat, Turn } from 'app/electric-state/_lib/type'
import { useEffect, useRef, useState } from 'react'

export interface CombatProps {
  combat: Combat
  isDM: boolean
}

type Position = {
  x: number
  y: number
}

export default function CombatPage({ combat, isDM }: CombatProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageSize, setImageSize] = useState<Position | null>(null)
  const [hoveredSquare, setHoveredSquare] = useState<Position | null>(null)

  useEffect(() => {
    if (!imageRef.current) return

    const updateImageSize = () => {
      const rect = imageRef.current?.getBoundingClientRect()
      if (rect) {
        setImageSize({
          x: rect.width,
          y: rect.height,
        })
      }
    }

    updateImageSize()
    const resizeObserver = new ResizeObserver(updateImageSize)
    resizeObserver.observe(imageRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageSize) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = rect.height - (event.clientY - rect.top) // Invert Y coordinate

    // Convert to grid coordinates
    const gridX = Math.floor(x / (rect.width / combat.map.gridX))
    const gridY = Math.floor(y / (rect.height / combat.map.gridY))

    if (gridX >= 0 && gridX < combat.map.gridX && gridY >= 0 && gridY < combat.map.gridY) {
      setHoveredSquare({ x: gridX, y: gridY })
    } else {
      setHoveredSquare(null)
    }
  }

  const renderTurn = (turn: Turn) => {
    if (!imageSize) return null

    const squareWidth = imageSize.x / combat.map.gridX
    const squareHeight = imageSize.y / combat.map.gridY

    // Calculate position with offset
    const x = (turn.posX + combat.map.offsetX) * squareWidth
    const y = imageSize.y - ((turn.posY + combat.map.offsetY + 1) * squareHeight) // +1 because posY is from bottom

    return (
      <div
        key={turn.name}
        className={`absolute rounded-full border-2 ${turn.state === 'alive' ? 'bg-green-500 border-green-700' : 
          turn.state === 'incapacitated' ? 'bg-yellow-500 border-yellow-700' : 'bg-red-500 border-red-700'}`}
        style={{
          width: squareWidth * 0.6,
          height: squareWidth * 0.6,
          left: x + (squareWidth * 0.2),
          top: y + (squareHeight * 0.2),
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
          {turn.name}
        </div>
      </div>
    )
  }

  if (!combat.active) return null

  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      <div className="flex-0 mt-4 mb-4 text-xl font-bold">
        Current Turn: {combat.currentTurn}
      </div>
      <div className="flex-1 flex justify-center items-center overflow-hidden relative w-full h-full">
        <div className="relative h-full">
          <img
            ref={imageRef}
            src={combat.map.url}
            alt="Combat Map"
            className="w-full h-full object-contain"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredSquare(null)}
          />
          {imageSize && combat.turns.map(renderTurn)}
          {isDM && hoveredSquare && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              x: {hoveredSquare.x}, y: {hoveredSquare.y}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}