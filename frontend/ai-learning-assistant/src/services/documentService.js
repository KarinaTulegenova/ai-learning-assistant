import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPaths"

export const uploadDocument = (file, title) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("title", title)

  return axiosInstance.post(API_PATHS.documents.upload, formData)
}

export const getDocuments = async () => {
  const res = await axiosInstance.get(API_PATHS.documents.list)
  return res.data
}

export const getDocumentById = async (id) => {
  const res = await axiosInstance.get(API_PATHS.documents.get(id))
  return res.data
}
