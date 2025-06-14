'use client'

import { useState } from 'react'
import { Stats, Traveler } from '../lib/type'

interface TravelersProps {
  travelerName: string
  travelers: Traveler[]
}

function withSign(v: number): string {
  return v < 0 ? v.toString() : `+${v}`
}

export default function Travelers({ travelerName, travelers }: TravelersProps) {
  const [currentTravelerName, setCurrentTravelerName] = useState(travelerName)
  const currentTraveler = travelers.find((t) => t.name === currentTravelerName)
  if (!currentTraveler) {
    return null
  }

  return (
    <div>
      <div className="flex flex-col justify-between items-center mb-6">
        <small className="w-full mb-2 underline" onClick={() => setCurrentTravelerName(travelerName)}>{currentTraveler.name !== travelerName ? '← Back to your character' : ''}</small>
        <h2 className="text-2xl font-bold">{currentTraveler.name} {(currentTraveler.name === travelerName ? '(You)' : '')}</h2>
      </div>
      <div className="space-y-6">
        <div key={currentTraveler.name} className="border-b pb-4">
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
            <p className="mb-0"><strong>Archetype:</strong> {currentTraveler.archetype}</p>
            <p className="mb-0"><strong>Dream:</strong> {currentTraveler.dream}</p>
            <p className="mb-0"><strong>Flaw:</strong> {currentTraveler.flaw}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Stats</h3>
            <div className="grid grid-cols-4 gap-2">
              {(['str', 'agi', 'wit', 'emp'] as (keyof Stats)[]).map((s) => (
                <div className="bg-gray-50 p-2 rounded text-center" key={s}>
                  <p className="mb-1"><strong>{s.toUpperCase()}</strong></p>
                  <p className="mb-0">{currentTraveler.stats[s]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Current State</h3>
            <div className="grid grid-cols-2">
              <p className="mb-0"><strong>Health:</strong> {currentTraveler.state.health}</p>
              <p className="mb-0"><strong>Hope:</strong> {currentTraveler.state.hope}</p>
              <p className="mb-0"><strong>Bliss:</strong> {currentTraveler.state.bliss}</p>
              <p className="mb-0"><strong>Cash:</strong> ${currentTraveler.state.cash}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Neurocaster</h3>
            <p className="mb-0"><strong>Name:</strong> {currentTraveler.neurocaster.name}</p>
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
                <div key={talent.title} className="bg-gray-50 p-3 rounded">
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
                <div key={index} className="bg-gray-50 p-3 rounded">
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
                <div key={otherTravelerName} className="bg-gray-50 p-3 rounded" onClick={() => setCurrentTravelerName(otherTravelerName)}>
                  <p className="font-semibold mb-1">{otherTravelerName}</p>
                  <p className="text-sm text-gray-600">{currentTraveler.state.tensions[otherTravelerName].num}</p>
                  <p className="text-sm text-gray-600">{currentTraveler.state.tensions[otherTravelerName].description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
