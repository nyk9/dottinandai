export interface Question {
  id: string;
  text: string;
  leftLabel: string;
  rightLabel: string;
}

export const questions: Question[] = [
  {
    id: "1",
    text: "消費税を10％から5％に引き下げるべきか",
    leftLabel: "引き下げるべき",
    rightLabel: "現状維持すべき",
  },
  {
    id: "2",
    text: "原子力発電所を再稼働すべきか",
    leftLabel: "再稼働すべき",
    rightLabel: "廃止すべき",
  },
  {
    id: "3",
    text: "憲法第9条を改正すべきか",
    leftLabel: "改正すべき",
    rightLabel: "改正すべきでない",
  },
];

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}
