import axios from 'axios'

const API_KEY = import.meta.env.VITE_NYT_API_KEY
const BASE_URL = 'https://api.nytimes.com/svc'

const nytApi = axios.create({
  baseURL: BASE_URL,
  params: { 'api-key': API_KEY }
})

export const getTopStories = async (section = 'home') => {
  const response = await nytApi.get(`/topstories/v2/${section}.json`)
  return response.data.results
}

export const getMostPopular = async () => {
  const response = await nytApi.get('/mostpopular/v2/viewed/1.json')
  return response.data.results
}

export const searchArticles = async (query) => {
  const response = await nytApi.get('/search/v2/articlesearch.json', {
    params: { q: encodeURIComponent(query) }
  })
  return response.data.response.docs.map(doc => ({
    title: doc.headline.main,
    abstract: doc.abstract,
    url: doc.web_url,
    section: doc.section_name,
    published_date: doc.pub_date,
    multimedia: doc.multimedia?.length > 0
      ? [{ url: `https://static01.nyt.com/${doc.multimedia[0].url}` }]
      : []
  }))
}