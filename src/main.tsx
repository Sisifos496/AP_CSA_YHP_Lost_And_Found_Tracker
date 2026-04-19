import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'

import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import LostFound from './pages/LostFound.tsx'
import Admin from './pages/Admin.tsx'
import Layout from './components/Layout.tsx'

const basename = import.meta.env.DEV ? '/' : '/AP_CSA_YHP_Lost_And_Found_Tracker/';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={basename}>
            <Layout>
                <Routes>
                    <Route index element={<Signup />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="lostfound" element={<LostFound />} />
                    <Route path="admin" element={<Admin />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    </StrictMode>,
)
