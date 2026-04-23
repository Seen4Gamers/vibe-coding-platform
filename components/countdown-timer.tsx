'use client'

import { useEffect, useState, useCallback } from 'react'

interface CountdownProps {
  endTime?: string
  onReset?: () => void
}

export function CountdownTimer({ endTime, onReset }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const getNextResetTime = useCallback(() => {
    // Get midnight UTC of the next day
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setUTCHours(24, 0, 0, 0)
    return tomorrow.getTime()
  }, [])

  const calculateTimeLeft = useCallback(() => {
    let targetTime: number

    if (endTime) {
      targetTime = new Date(endTime).getTime()
    } else {
      // Default to next midnight UTC (24-hour cycle)
      targetTime = getNextResetTime()
    }

    const now = new Date().getTime()
    let difference = targetTime - now

    // If timer has expired, reset to next 24-hour cycle
    if (difference <= 0) {
      if (onReset) onReset()
      targetTime = getNextResetTime()
      difference = targetTime - now
    }

    const totalSeconds = Math.floor(difference / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return { hours, minutes, seconds }
  }, [endTime, getNextResetTime, onReset])

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return (
    <div className="flex items-center gap-3">
      {/* Hours */}
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-3 rounded-xl shadow-lg">
          <span className="font-bold text-3xl text-white tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-orange-200 text-xs ml-1 font-medium">h</span>
        </div>
      </div>

      <span className="text-orange-500 text-2xl font-bold animate-pulse">:</span>

      {/* Minutes */}
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-3 rounded-xl shadow-lg">
          <span className="font-bold text-3xl text-white tabular-nums">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-orange-200 text-xs ml-1 font-medium">m</span>
        </div>
      </div>

      <span className="text-orange-500 text-2xl font-bold animate-pulse">:</span>

      {/* Seconds */}
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-3 rounded-xl shadow-lg">
          <span className="font-bold text-3xl text-white tabular-nums">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-orange-200 text-xs ml-1 font-medium">s</span>
        </div>
      </div>
    </div>
  )
}
