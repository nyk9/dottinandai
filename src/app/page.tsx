import { QuestionList } from "@/components/question-list";

export default function HomePage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium text-balance">政治アンケート</h1>
          <p className="text-muted-foreground leading-relaxed">
            各質問をクリックして、あなたの立場を選択してください
          </p>
        </div>

        <QuestionList />
      </div>
    </div>
  );
}
