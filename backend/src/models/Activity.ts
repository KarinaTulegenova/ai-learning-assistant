import mongoose from "mongoose"

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    metadata: { type: Object }
  },
  { timestamps: true }
)

export default mongoose.model("Activity", ActivitySchema)
