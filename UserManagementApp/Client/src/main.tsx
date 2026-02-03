import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserPage } from "./UserPage";
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <UserPage />
  </StrictMode>,
)
