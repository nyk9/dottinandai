export function saveResponse(questionId: string, position: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`responses:${questionId}`, position.toString())
}

export function loadResponse(questionId: string): number | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(`responses:${questionId}`)
  return stored ? Number.parseInt(stored, 10) : null
}

export function setResponseFinalized(questionId: string, finalized: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`responses:${questionId}:finalized`, finalized.toString())
}

export function isResponseFinalized(questionId: string): boolean {
  if (typeof window === "undefined") return false
  const stored = localStorage.getItem(`responses:${questionId}:finalized`)
  return stored === "true"
}
