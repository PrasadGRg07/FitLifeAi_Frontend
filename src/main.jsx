import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </CartProvider>
  </StrictMode>,
)
