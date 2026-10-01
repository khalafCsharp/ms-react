import axios from 'axios'

const API_URL = import.meta.env.API_URL

export const publicApi = axios.create({baseURL:API_URL});