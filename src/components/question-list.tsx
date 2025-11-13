import Link from "next/link"
import { Card } from "@/components/ui/card"
import { questions } from "@/lib/questions"

export function QuestionList() {
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Link key={question.id} href={`/question/${question.id}`}>
          <Card className="p-8 hover:bg-accent transition-colors cursor-pointer">
            <p className="text-lg leading-relaxed text-balance">{question.text}</p>
          </Card>
        </Link>
      ))}
    </div>
  )
}
