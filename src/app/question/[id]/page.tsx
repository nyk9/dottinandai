import { notFound } from "next/navigation"
import { QuestionDetail } from "@/components/question-detail"
import { QuestionStatsComponent } from "@/components/question-stats"
import { getQuestionById } from "@/lib/questions"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function QuestionPage({ params }: PageProps) {
  const { id } = await params
  const question = getQuestionById(id)

  if (!question) {
    notFound()
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <QuestionDetail question={question} />
        <QuestionStatsComponent questionId={id} />
      </div>
    </div>
  )
}
