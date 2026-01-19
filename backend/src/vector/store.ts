export type VectorChunk = {
  text: string
  embedding: number[]
}

const vectorStore = new Map<string, VectorChunk[]>()

export function addDocumentChunks(documentId: string, chunks: VectorChunk[]) {
  vectorStore.set(documentId, chunks)
}

export function getDocumentChunks(documentId?: string): VectorChunk[] {
  if (!documentId) {
    return Array.from(vectorStore.values()).flat()
  }
  return vectorStore.get(documentId) ?? []
}
