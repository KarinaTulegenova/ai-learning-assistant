import mongoose from "mongoose"

const QuizSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    questions: [
      {
        id: { type: String, required: true },
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model("Quiz", QuizSchema)
