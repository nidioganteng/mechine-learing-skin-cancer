import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mechine-learing-skin-cancer-production.up.railway.app',
  withCredentials: false,
})

export async function login(email, password) {
  const res = await api.post('/api/login', { email, password })
  return res.data
}

export async function register(nama_lengkap, email, password) {
  const res = await api.post('/api/register', { nama_lengkap, email, password })
  return res.data
}

export async function getDashboard() {
  const res = await api.get('/api/dashboard')
  return res.data
}

export async function getFormOptions() {
  const res = await api.get('/api/form_options')
  return res.data
}

export async function submitKuesioner(formData) {
  const res = await api.post('/api/prediksi_tahap1', formData)
  return res.data
}

export async function submitImageAnalysis(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await api.post('/prediksi_tahap2', fd)
  return res.data
}

export async function getRiwayat() {
  const res = await api.get('/api/riwayat')
  return res.data
}

export async function getProfil() {
  const res = await api.get('/api/profil')
  return res.data
}

export async function updateProfil(nama_lengkap) {
  const res = await api.post('/api/profil/update', { nama_lengkap })
  return res.data
}

export async function updatePassword(password_lama, password_baru) {
  const res = await api.post('/api/profil/password', { password_lama, password_baru })
  return res.data
}
