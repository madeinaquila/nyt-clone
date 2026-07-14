import { useState } from 'react'
import { useNews } from '../context/NewsContext'
import { searchArticles } from '../services/api'

const sections = ['home', 'world', 'technology', 'science', 'health', 'travel', 'arts']

function Navbar() {
  const { section, setSection, setArticles, darkMode, setDarkMode } = useNews()
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)

  const handleSection = (sec) => {
    setSection(sec)
    setArticles([])
    setQuery('')
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const data = await searchArticles(query)
      setArticles(data)
    } catch (error) {
      console.error('Errore ricerca:', error)
    } finally {
      setSearching(false)
    }
  }

  return (
    <nav style={{
      borderBottom: '2px solid var(--border)',
      padding: '16px 0',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      background: 'var(--nav-bg)',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px', marginBottom: '8px' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: 'none',
            border: '1px solid var(--text)',
            color: 'var(--text)',
            padding: '4px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', margin: '0 0 12px 0', color: 'var(--text)' }}>
        The New York Times
      </h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '12px' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cerca articoli..."
          style={{
            padding: '6px 14px',
            fontSize: '14px',
            border: '1px solid var(--input-border)',
            borderRadius: '20px',
            width: '280px',
            background: 'var(--input-bg)',
            color: 'var(--text)',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '8px',
            padding: '6px 16px',
            background: 'var(--text)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {searching ? '...' : 'Cerca'}
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {sections.map(sec => (
          <button
            key={sec}
            onClick={() => handleSection(sec)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: section === sec ? 'bold' : 'normal',
              textTransform: 'capitalize',
              borderBottom: section === sec ? '2px solid var(--text)' : 'none',
              paddingBottom: '4px',
              color: 'var(--text)'
            }}
          >
            {sec}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navbar