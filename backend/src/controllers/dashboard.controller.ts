import type { Request, Response } from "express"
import mongoose from "mongoose"
import User from "../models/User.js"
import Document from "../models/Document.js"
import Quiz from "../models/Quiz.js"
import FlashcardSet from "../models/FlashcardSet.js"
import Activity from "../models/Activity.js"

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const [user, documentsCount, quizzesCount, flashcardsAgg, recent] =
    await Promise.all([
      User.findById(userId).select("email"),
      Document.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
      FlashcardSet.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(String(userId)) } },
        { $group: { _id: null, total: { $sum: "$cardsCount" } } }
      ]),
      Activity.find({ userId }).sort({ createdAt: -1 }).limit(5)
    ])

  const flashcardsCount = flashcardsAgg[0]?.total ?? 0

  res.json({
    user: { email: user?.email ?? "" },
    stats: {
      documents: documentsCount,
      flashcards: flashcardsCount,
      quizzes: quizzesCount
    },
    recentActivity: recent.map(item => ({
      id: item._id,
      type: item.type,
      documentId: item.documentId,
      metadata: item.metadata,
      createdAt: item.createdAt
    }))
  })
}
