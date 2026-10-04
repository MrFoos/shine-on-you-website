import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

// index.html har statiske delingstagger for crawlere uten JavaScript. SEO.jsx
// skriver sidens egne, så de statiske må ut for ikke å bli stående dobbelt.
document.head.querySelectorAll('[data-static-social]').forEach((el) => el.remove())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
