import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import './i18n'
import App from './App'

// ตั้งค่า Base URL สำหรับ Axios เมื่อเปิดใช้งานบน GitHub Pages
if (window.location.hostname === 'hydra07188.github.io') {
  axios.defaults.baseURL = 'https://my-portfolio-api-alpha.vercel.app';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
