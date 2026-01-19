import { embedText } from "../ai/embed.js"
import { getDocumentChunks, type VectorChunk } from "./store.js"

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function searchSimilarChunks(
  query: string,
  documentId?: string,
  limit = 6
): Promise<VectorChunk[]> {
  const chunks = getDocumentChunks(documentId)
  if (chunks.length === 0) return []

  const queryEmbedding = await embedText(query)
  const scored = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(chunk.embedding, queryEmbedding)
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.chunk)
}
