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

export async function chatWithDocument(
  question: string,
  documentId: string
): Promise<string> {
  const chunks = await searchSimilarChunks(question, documentId, 6)
  const context = chunks.map(c => c.text).join("\n---\n")

  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Answer ONLY using the provided document context."
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`
      }
    ]
  })

  return response.choices[0].message.content ?? "No answer"
}
