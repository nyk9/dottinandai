"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PositionArea } from "@/components/PositionArea"
import { QuestionStatsComponent } from "@/components/question-stats"
import type { Question } from "@/types/question"
import { saveResponse, loadResponse, isResponseFinalized, setResponseFinalized } from "@/lib/storage"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

interface QuestionDetailProps {
  question: Question
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  const [value, setValue] = useState<number | null>(50)
  const [mounted, setMounted] = useState(false)
  const [isFinalized, setIsFinalized] = useState(false)

  useEffect(() => {
    console.log("=== QuestionDetail mounted ===")
    console.log("Question:", question)
    setMounted(true)
    const savedValue = loadResponse(question.id)
    if (savedValue !== null) {
      setValue(savedValue)
    }
    setIsFinalized(isResponseFinalized(question.id))
    console.log("Loaded value:", savedValue)
    console.log("Is finalized:", isResponseFinalized(question.id))
  }, [question.id])

  const handlePositionChange = (newValue: number) => {
    setValue(newValue)
  }

  const handleFinalize = async () => {
    console.log("=== handleFinalize called ===")
    console.log("Question ID:", question.id)
    console.log("Value:", value)

    alert("handleFinalize関数が呼ばれました！コンソールを確認してください。")

    if (value === null) {
      alert("値を選択してください。")
      return
    }

    // Save to localStorage
    saveResponse(question.id, value)
    setResponseFinalized(question.id, true)
    setIsFinalized(true)

    // Save to database
    try {
      console.log("Sending POST request to /api/responses", {
        questionId: question.id,
        value: value,
      })

      const response = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          value: value,
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
          <h1 className="text-3xl font-medium leading-relaxed text-balance">{question.title}</h1>
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
        <h1 className="text-3xl font-medium leading-relaxed text-balance">{question.title}</h1>

        <PositionArea
          value={value}
          onChange={handlePositionChange}
          leftLabel={question.left}
          rightLabel={question.right}
        />

        {!isFinalized && (
          <div className="flex justify-center">
            <Button onClick={handleFinalize}>
              回答を確定する
            </Button>
          </div>
        )}

        {isFinalized && (
          <div className="pt-8">
            <QuestionStatsComponent questionId={question.id} />
          </div>
        )}
      </div>
    </div>
  )
}
