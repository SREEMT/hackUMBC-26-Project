// frontend/src/api.js
const API_URL = 'http://localhost:3000'

export async function getItems() {
  const res = await fetch(`${API_URL}/items`)
  return res.json()
}
