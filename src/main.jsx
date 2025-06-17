import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './hooks/NotificationContext.jsx';
import { PetProvider } from './hooks/PetContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <PetProvider>
        <App />
      </PetProvider>
    </NotificationProvider>
  </StrictMode>,
)
