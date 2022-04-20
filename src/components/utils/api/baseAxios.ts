import axios, {AxiosInstance} from 'axios'

export const AXIOS: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
