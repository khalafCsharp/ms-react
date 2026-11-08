import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL


export const publicApi = axios.create({baseURL:API_URL});

// export const privateApi = axios.create({ baseURL: `${API_URL}/api/v1` });
export const privateApi = axios.create({ baseURL: API_URL });