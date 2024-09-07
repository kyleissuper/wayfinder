import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Card } from "./ui/card"
import { MapPin } from "lucide-react"

interface Location {
  id: string
  name: string
  position: {
    floor: number
  }
}

interface LocationSelectorProps {
  locations?: Location[]
  onStartLocationChange: (locationId: string) => void
  onEndLocationChange: (locationId: string) => void
}

export default function LocationSelector({
  locations = [],
  onStartLocationChange,
  onEndLocationChange,
}: LocationSelectorProps) {
  const [startSearchTerm, setStartSearchTerm] = useState<string>('')
  const [endSearchTerm, setEndSearchTerm] = useState<string>('')
  const [filteredStartLocations, setFilteredStartLocations] = useState<Location[]>([])
  const [filteredEndLocations, setFilteredEndLocations] = useState<Location[]>([])
  const [showStartSuggestions, setShowStartSuggestions] = useState<boolean>(false)
  const [showEndSuggestions, setShowEndSuggestions] = useState<boolean>(false)
  const [startSelectedIndex, setStartSelectedIndex] = useState<number>(0)
  const [endSelectedIndex, setEndSelectedIndex] = useState<number>(0)
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFilteredStartLocations(
      locations.filter(location =>
        location.name.toLowerCase().includes(startSearchTerm.toLowerCase())
      )
    )
    setStartSelectedIndex(0)
  }, [startSearchTerm, locations])

  useEffect(() => {
    setFilteredEndLocations(
      locations.filter(location =>
        location.name.toLowerCase().includes(endSearchTerm.toLowerCase())
      )
    )
    setEndSelectedIndex(0)
  }, [endSearchTerm, locations])

  const handleStartLocationSelect = (location: Location) => {
    setStartSearchTerm(location.name)
    onStartLocationChange(location.id)
    setShowStartSuggestions(false)
  }

  const handleEndLocationSelect = (location: Location) => {
    setEndSearchTerm(location.name)
    onEndLocationChange(location.id)
    setShowEndSuggestions(false)
  }

  const handleStartKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setStartSelectedIndex(prev => (prev + 1) % filteredStartLocations.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setStartSelectedIndex(prev => (prev - 1 + filteredStartLocations.length) % filteredStartLocations.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredStartLocations[startSelectedIndex]) {
        handleStartLocationSelect(filteredStartLocations[startSelectedIndex])
      }
    } else if (e.key === 'Tab') {
      if (filteredStartLocations[startSelectedIndex]) {
        handleStartLocationSelect(filteredStartLocations[startSelectedIndex])
      }
      // Allow default Tab behavior to move to next field
    }
  }

  const handleEndKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setEndSelectedIndex(prev => (prev + 1) % filteredEndLocations.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setEndSelectedIndex(prev => (prev - 1 + filteredEndLocations.length) % filteredEndLocations.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredEndLocations[endSelectedIndex]) {
        handleEndLocationSelect(filteredEndLocations[endSelectedIndex])
      }
    } else if (e.key === 'Tab') {
      if (filteredEndLocations[endSelectedIndex]) {
        handleEndLocationSelect(filteredEndLocations[endSelectedIndex])
      }
      // Allow default Tab behavior to move to next field
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startInputRef.current && !startInputRef.current.contains(event.target as Node)) {
        setShowStartSuggestions(false)
      }
      if (endInputRef.current && !endInputRef.current.contains(event.target as Node)) {
        setShowEndSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Card className="w-full mx-auto p-4 space-y-4 bg-white shadow-lg">
      <div className="flex items-center space-x-2">
        <MapPin className="text-red-500 flex-shrink-0" size={24} />
        <div className="w-full relative" ref={startInputRef}>
          <input
            type="text"
            placeholder="Search start location..."
            value={startSearchTerm}
            onChange={(e) => {
              setStartSearchTerm(e.target.value)
              setShowStartSuggestions(true)
            }}
            onFocus={() => setShowStartSuggestions(true)}
            onKeyDown={handleStartKeyDown}
            className="w-full p-2 border rounded"
          />
          {showStartSuggestions && filteredStartLocations.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto">
              {filteredStartLocations.map((location, index) => (
                <li
                  key={location.id}
                  onClick={() => handleStartLocationSelect(location)}
                  className={`p-2 cursor-pointer ${index === startSelectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  {location.name} (Floor {location.position.floor})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <MapPin className="text-green-500 flex-shrink-0" size={24} />
        <div className="w-full relative" ref={endInputRef}>
          <input
            type="text"
            placeholder="Search end location..."
            value={endSearchTerm}
            onChange={(e) => {
              setEndSearchTerm(e.target.value)
              setShowEndSuggestions(true)
            }}
            onFocus={() => setShowEndSuggestions(true)}
            onKeyDown={handleEndKeyDown}
            className="w-full p-2 border rounded"
          />
          {showEndSuggestions && filteredEndLocations.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto">
              {filteredEndLocations.map((location, index) => (
                <li
                  key={location.id}
                  onClick={() => handleEndLocationSelect(location)}
                  className={`p-2 cursor-pointer ${index === endSelectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  {location.name} (Floor {location.position.floor})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  )
}
