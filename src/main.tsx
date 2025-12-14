import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'

import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import ForgotPass from './pages/ForgotPass.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgotpass" element={<ForgotPass />} />      
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
