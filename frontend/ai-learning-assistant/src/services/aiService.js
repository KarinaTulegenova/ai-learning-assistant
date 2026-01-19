import axios from "../utils/axiosInstance"

export const askAI = async (docId, message) => {
  const res = await axios.post(`/documents/${docId}/chat`, { message })
  return res.data
}
