import axios from "../utils/axiosInstance"

export const login = (data) =>
  axios.post("/auth/login", data).then(res => res.data)

export const register = (data) =>
  axios.post("/auth/register", data)

export const getMe = () =>
  axios.get("/auth/me").then(res => res.data)

export const logout = () =>
  axios.post("/auth/logout")