"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PositionArea } from "@/components/position-area"
import { QuestionStatsComponent } from "@/components/question-stats"
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
    console.log("=== QuestionDetail mounted ===")
    console.log("Question:", question)
    setMounted(true)
    const savedPosition = loadResponse(question.id)
    if (savedPosition !== null) {
      setPosition(savedPosition)
    }
    setIsFinalized(isResponseFinalized(question.id))
    console.log("Loaded position:", savedPosition)
    console.log("Is finalized:", isResponseFinalized(question.id))
  }, [question.id])

  const handlePositionChange = (newPosition: number) => {
    setPosition(newPosition)
  }

  const handleFinalize = async () => {
    console.log("=== handleFinalize called ===")
    console.log("Question ID:", question.id)
    console.log("Position:", position)

    alert("handleFinalize関数が呼ばれました！コンソールを確認してください。")

    // Save to localStorage
    saveResponse(question.id, position)
    setResponseFinalized(question.id, true)
    setIsFinalized(true)

    // Save to database
    try {
      console.log("Sending POST request to /api/responses", {
        questionId: question.id,
        value: position,
      })

      const response = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          value: position,
        }),
      })

      console.log("POST response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to save response to database:", response.status, errorData)
        alert(`データベースへの保存に失敗しました: ${errorData.error || response.statusText}`)
        return
      }

      const result = await response.json()
      console.log("Successfully saved to database:", result)
      alert("データベースへの保存に成功しました！")
    } catch (error) {
      console.error("Error saving response to database:", error)
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    }
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

        {isFinalized && (
          <div className="pt-8">
            <QuestionStatsComponent questionId={question.id} />
          </div>
        )}
      </div>
    </div>
  )
}
