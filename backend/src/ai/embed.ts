import OpenAI from "openai"

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

export async function embedText(text: string) {
  const response = await getClient().embeddings.create({
    model: "text-embedding-3-small",
    input: text
  })

  return response.data[0].embedding
}
