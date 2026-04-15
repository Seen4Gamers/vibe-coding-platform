'use client'

import { useEffect, useState, useCallback } from 'react'

interface CountdownProps {
  endTime: string
  onExpire?: () => void
}

export function CountdownTimer({ endTime, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const calculateTimeLeft = useCallback(() => {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const difference = end - now

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    } else {
      // Timer expired - trigger callback
      if (onExpire) {
        onExpire()
      }
      return { hours: 0, minutes: 0, seconds: 0 }
    }
  }, [endTime, onExpire])

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className="flex items-center gap-2">
      {isExpired ? (
        <span className="text-orange-600 font-semibold animate-pulse">Resetting...</span>
      ) : (
        <>
          <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
            <span className="font-bold text-2xl text-orange-600">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-xs text-orange-500">h</span>
          </span>
          <span className="text-orange-400 font-bold">:</span>
          <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
            <span className="font-bold text-2xl text-orange-600">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-xs text-orange-500">m</span>
          </span>
          <span className="text-orange-400 font-bold">:</span>
          <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
            <span className="font-bold text-2xl text-orange-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-xs text-orange-500">s</span>
          </span>
        </>
      )}
    </div>
  )
}
