import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import '../ src/index.css'
import { ThemeProvider } from "./Components/theme-provider.jsx"
import { Toaster } from './Components/ui/toaster.jsx'
import { ModeToggle } from './Components/mode-toggle.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
       <App />
       
       <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
