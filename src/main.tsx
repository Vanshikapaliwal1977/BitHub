import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { ContentProvider } from './contexts/ContentContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
