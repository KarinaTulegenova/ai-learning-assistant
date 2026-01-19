import mongoose from "mongoose"

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model("Document", DocumentSchema)
