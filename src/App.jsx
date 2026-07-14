import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useNews } from './context/NewsContext'
import HomePage from './pages/HomePage'

function App() {
  const { darkMode } = useNews()

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    document.body.style.backgroundColor = darkMode ? '#121212' : 'white'
  }, [darkMode])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App