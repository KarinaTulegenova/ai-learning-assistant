import OpenAI from "openai"
import { searchSimilarChunks } from "../vector/search.js"

let client: OpenAI | null = null

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing")
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  return client
}

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

type QuizPayload = {
  quizId: string
  questions: QuizQuestion[]
}

function safeJsonParse(value: string): QuizPayload | null {
  try {
    return JSON.parse(value) as QuizPayload
  } catch {
    return null
  }
}

function buildContext(contextText?: string) {
  if (!contextText) return ""
  return contextText.slice(0, 8000)
}

export async function generateQuizForDocument(
  documentId: string,
  contextText?: string
) {
  const chunks = await searchSimilarChunks("quiz questions", documentId, 8)
  const context =
    buildContext(contextText) || chunks.map(c => c.text).join("\n---\n")

  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Generate a quiz in STRICT JSON. Use schema: {\"quizId\":\"string\",\"questions\":[{\"id\":\"string\",\"question\":\"string\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctAnswer\":\"string\"}]}. Return ONLY JSON."
      },
      {
        role: "user",
        content: `Context:\n${context}`
      }
    ]
  })

  const content = response.choices[0].message.content ?? "{}"
  const parsed = safeJsonParse(content)

  return (
    parsed ?? {
      quizId: documentId,
      questions: []
    }
  )
}
