import { notFound } from "next/navigation"
import { QuestionDetail } from "@/components/question-detail"
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
      <div className="max-w-3xl mx-auto">
        <QuestionDetail question={question} />
      </div>
    </div>
  )
}
