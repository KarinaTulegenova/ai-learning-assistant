import axios from "../utils/axiosInstance"

export const getFlashcardsByDocument = async (documentId) => {
  const res = await axios.get(`/flashcards`, {
    params: { documentId }
  })
  return res.data
}

export const generateFlashcards = async (documentId) => {
  const res = await axios.post(`/documents/${documentId}/flashcards`)
  return res.data
}
