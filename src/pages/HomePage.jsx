import { useEffect, useState } from 'react'
import { getTopStories, getMostPopular } from '../services/api'
import { useNews } from '../context/NewsContext'
import Navbar from '../components/Navbar'

const FALLBACK_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/New_York_Times_logo_variation.jpg/320px-New_York_Times_logo_variation.jpg'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticleCard({ article, isHero = false }) {
  const [hovered, setHovered] = useState(false)

  if (isHero) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          marginBottom: '40px',
          borderBottom: '2px solid var(--text)',
          paddingBottom: '30px',
          cursor: 'pointer'
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <img
            src={article.multimedia?.[0]?.url || FALLBACK_IMG}
            alt={article.title}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              marginBottom: '20px',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.02)' : 'scale(1)'
            }}
          />
        </div>
        <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--subtext)', marginBottom: '4px' }}>
          {article.section}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--subtext)', marginBottom: '8px' }}>
          {formatDate(article.published_date)}
        </p>
        <h1 style={{
          fontSize: '2rem',
          lineHeight: '1.3',
          marginBottom: '12px',
          fontFamily: 'Georgia, serif',
          color: 'var(--text)',
          textDecoration: hovered ? 'underline' : 'none'
        }}>
          {article.title}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--subtext)', marginBottom: '16px', lineHeight: '1.6' }}>
          {article.abstract}
        </p>
        <a href={article.url} target="_blank" rel="noreferrer"
          style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>
          Leggi tutto
        </a>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        paddingBottom: '20px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <img
          src={article.multimedia?.[0]?.url || FALLBACK_IMG}
          alt={article.title}
          style={{
            width: '100%',
            height: '160px',
            objectFit: 'cover',
            marginBottom: '10px',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      </div>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--subtext)', marginBottom: '2px' }}>
        {article.section}
      </p>
      <p style={{ fontSize: '10px', color: 'var(--subtext)', marginBottom: '6px' }}>
        {formatDate(article.published_date)}
      </p>
      <h2 style={{
        fontSize: '1rem',
        marginBottom: '8px',
        fontFamily: 'Georgia, serif',
        lineHeight: '1.4',
        color: 'var(--text)',
        textDecoration: hovered ? 'underline' : 'none'
      }}>
        {article.title}
      </h2>
      <a href={article.url} target="_blank" rel="noreferrer"
        style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '13px' }}>
        Leggi tutto
      </a>
    </div>
  )
}

function HomePage() {
  const { articles, setArticles, popular, setPopular, loading, setLoading, section } = useNews()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const ARTICLES_PER_PAGE = 9

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      setPage(1)
      try {
        const data = await getTopStories(section)
        setArticles(data)
      } catch (err) {
        setError('Errore nel caricamento delle notizie. Riprova piu tardi.')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [section])

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getMostPopular()
        setPopular(data)
      } catch (err) {
        console.error('Errore Most Popular:', err)
      }
    }
    fetchPopular()
  }, [])

  const validArticles = articles.filter(a => a.title && a.title !== '')
  const hero = validArticles[0]
  const rest = validArticles.slice(1, 1 + page * ARTICLES_PER_PAGE)
  const hasMore = validArticles.length > 1 + page * ARTICLES_PER_PAGE

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: '40px'
      }}>

        <div>
          {loading && <p style={{ color: 'var(--subtext)' }}>Caricamento...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {hero && <ArticleCard article={hero} isHero={true} />}

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '24px'
          }}>
            {rest.map((article) => (
              <ArticleCard key={article.url} article={article} />
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  background: 'var(--text)',
                  color: 'var(--bg)',
                  border: 'none',
                  padding: '12px 32px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              >
                Carica altri articoli
              </button>
            </div>
          )}
        </div>

        {!isMobile && (
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '30px' }}>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              borderBottom: '2px solid var(--text)',
              paddingBottom: '8px',
              marginBottom: '16px',
              color: 'var(--text)'
            }}>
              Most Popular
            </h3>
            {popular.slice(0, 8).map((article, index) => (
              <div key={article.url} style={{
                borderBottom: '1px solid var(--border)',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--border)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  {index + 1}
                </span>
                <a href={article.url} target="_blank" rel="noreferrer"
                  style={{
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                  {article.title}
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default HomePage