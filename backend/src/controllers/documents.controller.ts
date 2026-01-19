import type { Request, Response } from "express"
import fs from "fs/promises"
import path from "path"
import pdf from "pdf-parse"
import mammoth from "mammoth"
import Document from "../models/Document.js"
import Activity from "../models/Activity.js"
import Quiz from "../models/Quiz.js"
import FlashcardSet from "../models/FlashcardSet.js"
import { embedText } from "../ai/embed.js"
import { addDocumentChunks } from "../vector/store.js"
import { chatWithDocument } from "../ai/chat.js"
import { generateQuizForDocument } from "../ai/quiz.js"
import { generateFlashcardsForDocument } from "../ai/flashcards.js"

const ALLOWED_MIME = new Set([
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
])

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function chunkText(text: string, size = 900, overlap = 150) {
  const chunks: string[] = []
  const trimmed = text.trim()
  if (!trimmed) return chunks

  let start = 0

  while (start < text.length) {
    const end = Math.min(start + size, text.length)
    if (end <= start) break
    chunks.push(text.slice(start, end))
    start = end - overlap
    if (start < 0) start = 0
  }

  return chunks
}

async function extractText(filePath: string, mimeType: string) {
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error("Unsupported file type")
  }

  if (mimeType === "text/plain") {
    return await fs.readFile(filePath, "utf8")
  }

  if (mimeType === "application/pdf") {
    const dataBuffer = await fs.readFile(filePath)
    const parsed = await pdf(dataBuffer)
    return parsed.text
  }

  const result = await mammoth.extractRawText({ path: filePath })
  return result.value
}

async function findOwnedDocument(req: Request, res: Response) {
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ message: "Not authorized" })
    return null
  }

  const doc = await Document.findOne({ _id: req.params.id, userId }).select(
    "_id title text"
  )
  if (!doc) {
    res.status(404).json({ message: "Document not found" })
    return null
  }

  return doc
}

async function logActivity(
  userId: string,
  type: string,
  documentId?: string,
  metadata?: Record<string, unknown>
) {
  await Activity.create({
    userId,
    type,
    documentId,
    metadata
  })
}

function normalizeQuizQuestions(
  questions: { id?: string; question: string; options: string[]; correctAnswer: string }[]
) {
  return questions.map((q, idx) => ({
    id: q.id ?? `${Date.now()}-${idx}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer
  }))
}

function normalizeFlashcards(cards: { id?: string; question: string; answer: string }[]) {
  return cards.map((c, idx) => ({
    id: c.id ?? `${Date.now()}-${idx}`,
    question: c.question,
    answer: c.answer
  }))
}

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    const file = req.file
    if (!userId || !file) {
      return res.status(400).json({ message: "File and user required" })
    }

    const title = String(req.body.title || file.originalname)
    const text = normalizeText(await extractText(file.path, file.mimetype))

    const doc = await Document.create({
      userId,
      title,
      filename: path.basename(file.path),
      mimeType: file.mimetype,
      size: file.size,
      text
    })

    const chunks = chunkText(text)
    const embeddings = await Promise.all(chunks.map(embedText))
    addDocumentChunks(
      doc._id.toString(),
      chunks.map((chunk, idx) => ({
        text: chunk,
        embedding: embeddings[idx]
      }))
    )

    await logActivity(userId, "upload_document", doc._id.toString(), {
      title: doc.title
    })

    res.status(201).json({
      document: {
        id: doc._id,
        title: doc.title,
        size: doc.size
      }
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const listDocuments = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const docs = await Document.find({ userId })
    .sort({ createdAt: -1 })
    .select("_id title size createdAt")

  res.json({
    documents: docs.map(d => ({
      id: d._id,
      title: d.title,
      size: d.size,
      createdAt: d.createdAt
    }))
  })
}

export const getDocumentById = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const doc = await Document.findOne({
    _id: req.params.id,
    userId
  }).select("_id title size createdAt")

  if (!doc) {
    return res.status(404).json({ message: "Document not found" })
  }

  res.json({
    document: {
      id: doc._id,
      title: doc.title,
      size: doc.size,
      createdAt: doc.createdAt
    }
  })
}

export const chatDocument = async (req: Request, res: Response) => {
  const { message } = req.body
  if (!message) {
    return res.status(400).json({ message: "Message required" })
  }

  const doc = await findOwnedDocument(req, res)
  if (!doc) return

  const userId = String(req.user?.userId)
  const documentId = String(req.params.id)
  const answer = await chatWithDocument(message, documentId)

  await logActivity(userId, "chat_question", documentId, {
    title: doc.title
  })

  res.json({ answer })
}

export const quizDocument = async (req: Request, res: Response) => {
  const doc = await findOwnedDocument(req, res)
  if (!doc) return

  const userId = String(req.user?.userId)
  const documentId = String(req.params.id)
  const quiz = await generateQuizForDocument(documentId, doc.text)
  const questions = normalizeQuizQuestions(quiz.questions)

  const saved = await Quiz.create({
    userId,
    documentId,
    questions
  })

  await logActivity(userId, "generated_quiz", documentId, {
    title: doc.title,
    quizId: saved._id.toString()
  })

  res.json({
    quiz: {
      id: saved._id,
      questions
    }
  })
}

export const flashcardsDocument = async (req: Request, res: Response) => {
  const doc = await findOwnedDocument(req, res)
  if (!doc) return

  const userId = String(req.user?.userId)
  const documentId = String(req.params.id)
  const data = await generateFlashcardsForDocument(documentId, doc.text)
  const cards = normalizeFlashcards(data.flashcards)

  const saved = await FlashcardSet.create({
    userId,
    documentId,
    cards,
    cardsCount: cards.length
  })

  await logActivity(userId, "generated_flashcards", documentId, {
    title: doc.title,
    flashcardsId: saved._id.toString()
  })

  res.json({
    id: saved._id,
    flashcards: cards,
    createdAt: saved.createdAt
  })
}
