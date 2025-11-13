"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface PositionAreaProps {
  position: number
  onChange: (position: number) => void
  leftLabel: string
  rightLabel: string
  isFinalized: boolean
  onFinalize: () => void
}

export function PositionArea({
  position,
  onChange,
  leftLabel,
  rightLabel,
  isFinalized,
  onFinalize,
}: PositionAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const calculatePosition = (clientX: number): number => {
    if (!containerRef.current) return position
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return Math.round((x / rect.width) * 100)
  }

  const handleStart = (clientX: number) => {
    if (isFinalized) return
    setIsDragging(true)
    const newPosition = calculatePosition(clientX)
    onChange(newPosition)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || isFinalized) return
    const newPosition = calculatePosition(clientX)
    onChange(newPosition)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinalized) return
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      const delta = e.shiftKey ? 10 : 1
      onChange(Math.max(0, position - delta))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      const delta = e.shiftKey ? 10 : 1
      onChange(Math.min(100, position + delta))
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleTouchEnd)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, position])

  const markerPositions = [0, 25, 50, 75, 100]

  return (
    <div className="w-full space-y-8">
      {/* Labels */}
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1 text-left">
          <p className="text-sm font-medium leading-relaxed text-balance">{leftLabel}</p>
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-medium leading-relaxed text-balance">{rightLabel}</p>
        </div>
      </div>

      {/* Interactive area */}
      <div
        ref={containerRef}
        className={`relative w-full h-24 bg-secondary rounded-lg touch-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background overflow-hidden ${
          isFinalized ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={isFinalized ? -1 : 0}
        role="slider"
        aria-label="Position selector"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        aria-disabled={isFinalized}
      >
        <div
          className={`absolute top-0 bottom-0 w-full transition-all bg-teal-200`}
        />

        {/* Grid lines */}
        {markerPositions.map((pos) => (
          <div key={pos} className="absolute top-0 bottom-0 w-px bg-border z-10" style={{ left: `${pos}%` }} />
        ))}

        <div className="absolute top-0 bottom-0 w-0.5 bg-border/60 z-10" style={{ left: "50%" }} />

        {/* Position marker */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 -ml-5 rounded-full shadow-xl transition-all pointer-events-none z-20 border-3 ${
            isFinalized ? "bg-teal-600 border-teal-800" : "bg-teal-500 border-teal-700"
          }`}
          style={{ left: `${position}%` }}
        />
      </div>

      {/* Current position display */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          あなたの位置：<span className="font-medium text-foreground">{position}</span> / 100
        </p>
      </div>

      {!isFinalized ? (
        <div className="flex justify-center pt-4">
          <button
            onClick={onFinalize}
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            この位置で決定
          </button>
        </div>
      ) : (
        <div className="text-center pt-4">
          <p className="text-sm font-medium text-primary">回答を保存しました</p>
        </div>
      )}
    </div>
  )
}
