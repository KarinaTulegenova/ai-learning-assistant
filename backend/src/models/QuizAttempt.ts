import mongoose from "mongoose"

const QuizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    score: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { timestamps: true }
)

export default mongoose.model("QuizAttempt", QuizAttemptSchema)
