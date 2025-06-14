'use client'

import { useRef, useState } from 'react'
import { Stats, Traveler } from '../lib/type'
import styles from './Book.module.scss'

interface TravelersProps {
  travelerName: string
  travelers: Traveler[]
}

function withSign(v: number): string {
  return v < 0 ? v.toString() : `+${v}`
}

export default function Travelers({ travelerName, travelers }: TravelersProps) {
  const [currentTravelerName, setCurrentTravelerName] = useState(travelerName)
  const titleRef = useRef<HTMLDivElement>(null)
  const currentTraveler = travelers.find((t) => t.name === currentTravelerName)
  if (!currentTraveler) {
    return null
  }

  const switchToTraveler = (travelerName: string) => {
    setCurrentTravelerName(travelerName)
    if (!!titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="p-8" ref={titleRef}>
      <div className="flex flex-col justify-between items-center mb-6">
        <small className="w-full mb-2 underline" onClick={() => setCurrentTravelerName(travelerName)}>{currentTraveler.name !== travelerName ? '← Back to your character' : ''}</small>
        <h2 className="text-2xl font-bold">{currentTraveler.name} {(currentTraveler.name === travelerName ? '(You)' : '')}</h2>
      </div>
      <div className="space-y-6">
        <div key={currentTraveler.name} className="pb-4">
          
          <div className="mb-6">
            <div className="flex flex-row justify-center items-center mb-2">
              <h3 className="text-lg font-semibold whitespace-nowrap">Basic Info</h3>
              <span className="ml-3 w-full h-0 border-b-4 border-black" />
            </div>
            <p className="mb-0"><strong>Archetype:</strong> {currentTraveler.archetype}</p>
            <p className="mb-0"><strong>Dream:</strong> {currentTraveler.dream}</p>
            <p className="mb-0"><strong>Flaw:</strong> {currentTraveler.flaw}</p>
          </div>

          <div className="mb-6">
            <div className="flex flex-row justify-center items-center mb-2">
              <h3 className="text-lg font-semibold whitespace-nowrap">Stats</h3>
              <span className="ml-3 w-full h-0 border-b-4 border-black" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['str', 'agi', 'wit', 'emp'] as (keyof Stats)[]).map((s) => (
                <div className="p-2 border-4 border-black text-center" key={s}>
                  <p className="mb-1"><strong>{s.toUpperCase()}</strong></p>
                  <p className="mb-0 text-xl">{currentTraveler.stats[s]}</p>
                  {!!currentTraveler.state.statsModifier[s] && (<small className="mb-0 text-sm text-gray-600">({currentTraveler.state.statsModifier[s]})</small>)}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-row justify-center items-center mb-2">
              <h3 className="text-lg font-semibold whitespace-nowrap">Current State</h3>
              <span className="ml-3 w-full h-0 border-b-4 border-black" />
            </div>
            <div className="grid grid-cols-2">
              <p className="mb-0"><strong>Health:</strong> {currentTraveler.state.health}</p>
              <p className="mb-0"><strong>Hope:</strong> {currentTraveler.state.hope}</p>
              <p className="mb-0"><strong>Bliss:</strong> {currentTraveler.state.bliss}</p>
              <p className="mb-0"><strong>Cash:</strong> ${currentTraveler.state.cash}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-row justify-center items-center mb-2">
              <h3 className="text-lg font-semibold whitespace-nowrap">Neurocaster</h3>
              <span className="ml-3 w-full h-0 border-b-4 border-black" />
            </div>
            <p className="mb-0"><strong>Name:</strong> {currentTraveler.neurocaster.name}</p>
            <p className="mb-0"><strong>Price:</strong> ${currentTraveler.neurocaster.price}</p>
            <div className="grid grid-cols-2">
              <p className="mb-0"><strong>Processor:</strong> {withSign(currentTraveler.neurocaster.processor)}</p>
              <p className="mb-0"><strong>Network:</strong> {withSign(currentTraveler.neurocaster.network)}</p>
              <p className="mb-0"><strong>Graphics:</strong> {withSign(currentTraveler.neurocaster.graphics)}</p>
              <p className="mb-0"><strong>Mobility:</strong> {withSign(currentTraveler.neurocaster.mobility)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Talents</h3>
            <div className="grid grid-cols-1 gap-4">
              {(currentTraveler.talents || []).map((talent) => (
                <div key={talent.title} className="border-4 border-black p-3">
                  <p className="font-semibold mb-1">{talent.title}</p>
                  <p className="text-sm text-gray-600">{talent.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Personal Items</h3>
            <div className="grid grid-cols-1 gap-4">
              {(currentTraveler.personalItem || []).map((item, index) => (
                <div key={index} className="border-4 border-black p-3">
                  <p className="font-semibold">{item.name} ({item.type})</p>
                  {item.type === 'gear' && (
                    <>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600"><strong>Price:</strong> ${item.price}</p>
                    </>
                  )}
                  {item.type === 'weapon' && (
                    <>
                      <p className="text-sm text-gray-600"><strong>Damage</strong>: {item.damage}</p>
                      <p className="text-sm text-gray-600"><strong>Bonus</strong>: {withSign(item.bonus)}</p>
                      <p className="text-sm text-gray-600"><strong>Min Range</strong>: {item.minRange}</p>
                      <p className="text-sm text-gray-600"><strong>Max Range</strong>: {item.maxRange}</p>
                      <p className="text-sm text-gray-600"><strong>Price</strong>: ${item.price}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tensions</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(currentTraveler.state.tensions).map((otherTravelerName) => (
                <div key={otherTravelerName} className="border-4 border-black p-3 flex flex-row items-center" onClick={() => switchToTraveler(otherTravelerName)}>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{otherTravelerName}: {currentTraveler.state.tensions[otherTravelerName].level} / 2</p>
                    <p className="text-sm text-gray-600">{currentTraveler.state.tensions[otherTravelerName].description}</p>
                  </div>
                  <div className={`${styles.arrowRight} `} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
