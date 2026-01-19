import type { Request, Response } from "express"
import Quiz from "../models/Quiz.js"
import QuizAttempt from "../models/QuizAttempt.js"
import Activity from "../models/Activity.js"

export const listQuizzes = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const documentId = req.query.documentId
  const filter: Record<string, unknown> = { userId }
  if (documentId) {
    filter.documentId = String(documentId)
  }

  const quizzes = await Quiz.find(filter)
    .sort({ createdAt: -1 })
    .select("_id documentId createdAt")

  res.json({
    quizzes: quizzes.map(q => ({
      id: q._id,
      documentId: q.documentId,
      createdAt: q.createdAt
    }))
  })
}

export const submitQuiz = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const quizId = String(req.params.quizId)
  const { answers } = req.body as {
    answers?: { questionId: string; answer: string }[]
  }

  const quiz = await Quiz.findOne({ _id: quizId, userId })
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" })
  }

  const safeAnswers = Array.isArray(answers) ? answers : []
  const answerMap = new Map(safeAnswers.map(a => [a.questionId, a.answer]))
  const detailed = quiz.questions.map(q => {
    const userAnswer = answerMap.get(q.id)
    return {
      questionId: q.id,
      question: q.question,
      userAnswer: userAnswer ?? "",
      correctAnswer: q.correctAnswer,
      correct: userAnswer === q.correctAnswer
    }
  })

  const score = detailed.filter(a => a.correct).length
  const total = quiz.questions.length

  const attempt = await QuizAttempt.create({
    userId,
    documentId: quiz.documentId,
    quizId: quiz._id,
    answers: safeAnswers,
    score,
    total
  })

  await Activity.create({
    userId,
    type: "completed_quiz",
    documentId: quiz.documentId,
    metadata: { quizId: quiz._id.toString(), score, total }
  })

  res.json({
    attemptId: attempt._id,
    score,
    total,
    answers: detailed
  })
}

export const listQuizHistory = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const documentId = req.query.documentId
  const filter: Record<string, unknown> = { userId }
  if (documentId) {
    filter.documentId = String(documentId)
  }

  const attempts = await QuizAttempt.find(filter)
    .sort({ createdAt: -1 })
    .limit(10)

  res.json({
    attempts: attempts.map(a => ({
      id: a._id,
      quizId: a.quizId,
      documentId: a.documentId,
      score: a.score,
      total: a.total,
      createdAt: a.createdAt
    }))
  })
}
