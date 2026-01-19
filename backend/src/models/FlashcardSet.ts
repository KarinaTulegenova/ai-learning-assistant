import mongoose from "mongoose"

const FlashcardSetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    cards: [
      {
        id: { type: String, required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    cardsCount: { type: Number, required: true }
  },
  { timestamps: true }
)

export default mongoose.model("FlashcardSet", FlashcardSetSchema)
