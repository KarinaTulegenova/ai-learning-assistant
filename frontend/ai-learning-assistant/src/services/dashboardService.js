import axios from "../utils/axiosInstance"

export const getDashboard = async () => {
  const res = await axios.get("/dashboard")
  return res.data
}
