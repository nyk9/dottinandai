"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PositionArea } from "@/components/position-area"
import type { Question } from "@/lib/questions"
import { saveResponse, loadResponse, isResponseFinalized, setResponseFinalized } from "@/lib/storage"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

interface QuestionDetailProps {
  question: Question
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  const [position, setPosition] = useState(50)
  const [mounted, setMounted] = useState(false)
  const [isFinalized, setIsFinalized] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedPosition = loadResponse(question.id)
    if (savedPosition !== null) {
      setPosition(savedPosition)
    }
    setIsFinalized(isResponseFinalized(question.id))
  }, [question.id])

  const handlePositionChange = (newPosition: number) => {
    setPosition(newPosition)
  }

  const handleFinalize = () => {
    saveResponse(question.id, position)
    setResponseFinalized(question.id, true)
    setIsFinalized(true)
  }

  if (!mounted) {
    return (
      <div className="space-y-12">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <div className="space-y-12">
          <h1 className="text-3xl font-medium leading-relaxed text-balance">{question.text}</h1>
          <div className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <Link href="/">
        <Button variant="ghost" size="sm">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          戻る
        </Button>
      </Link>

      <div className="space-y-12">
        <h1 className="text-3xl font-medium leading-relaxed text-balance">{question.text}</h1>

        <PositionArea
          position={position}
          onChange={handlePositionChange}
          leftLabel={question.leftLabel}
          rightLabel={question.rightLabel}
          isFinalized={isFinalized}
          onFinalize={handleFinalize}
        />
      </div>
    </div>
  )
}
