'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  endTime: string
}

export function CountdownTimer({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="flex items-center gap-2 text-lg font-semibold text-orange-600">
      <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
        <span className="font-bold text-2xl">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs">h</span>
      </span>
      <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
        <span className="font-bold text-2xl">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs">m</span>
      </span>
      <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
        <span className="font-bold text-2xl">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs">s</span>
      </span>
    </div>
  )
}
