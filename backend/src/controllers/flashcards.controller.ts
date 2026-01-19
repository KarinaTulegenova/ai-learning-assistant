import type { Request, Response } from "express"
import FlashcardSet from "../models/FlashcardSet.js"

export const getLatestFlashcards = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const documentId = String(req.query.documentId || "")
  if (!documentId) {
    return res.status(400).json({ message: "documentId required" })
  }

  const latest = await FlashcardSet.findOne({ userId, documentId })
    .sort({ createdAt: -1 })
    .select("_id cards createdAt")

  if (!latest) {
    return res.json({ id: null, flashcards: [] })
  }

  res.json({
    id: latest._id,
    flashcards: latest.cards,
    createdAt: latest.createdAt
  })
}
