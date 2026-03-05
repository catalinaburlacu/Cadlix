import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import { exploreCategories, carouselRows, MOVIE_DATABASE } from '../../../mocks/explore.js'
import SearchBar from './SearchBar.jsx'
import '../home/Home.css'
import './Explore.css'

function getVisibleItems(items, start, count) {
  return Array.from({ length: count }, (_, offset) => {
    const index = (start + offset) % items.length
    return items[index]
  })
}

export default function Explore() {
  const [carouselIndex, setCarouselIndex] = useState(() =>
    Object.fromEntries(carouselRows.map(row => [row.id, 0]))
  )

  useEffect(() => {
    const timeoutIds = []
    const intervalIds = []

    carouselRows.forEach((row, rowIndex) => {
      const startDelay = rowIndex * 2000
      const rotationInterval = 8000 + rowIndex * 1200
      const stepSize = rowIndex % 2 === 0 ? 1 : 2

      const timeoutId = setTimeout(() => {
        const intervalId = setInterval(() => {
          setCarouselIndex(prev => ({
            ...prev,
            [row.id]: ((prev[row.id] ?? 0) + stepSize) % row.items.length,
          }))
        }, rotationInterval)
        intervalIds.push(intervalId)
      }, startDelay)

      timeoutIds.push(timeoutId)
    })

    return () => {
      timeoutIds.forEach(clearTimeout)
      intervalIds.forEach(clearInterval)
    }
  }, [])

  return (
    <SidebarLayout
      pageClass='explore-page'
      navbarContent={<h1 className='explore-heading'>Explore by Categories</h1>}
    >
      <div className='page-content explore-content'>
        <section className='explore-intro'>
          <div className='explore-intro-content'>
            <h2>Quickly search for your favorite content</h2>
            <p>Browse titles by category for faster discovery and better organization.</p>
          </div>
          <div className='explore-intro-search'>
            <SearchBar />
          </div>
        </section>

        <section className='explore-categories-grid'>
          {exploreCategories.map(category => (
            <article key={category.id} className='explore-category-card' id={category.id}>
              <div className='explore-card-head'>
                <div className='explore-card-icon'>
                  <i className={`bx ${category.icon}`}></i>
                </div>
                <h3>{category.title}</h3>
              </div>
              <div className='explore-chip-list'>
                {category.items.map(item => (
                  <button key={item} type='button' className='explore-chip'>
                    {item}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className='explore-carousel-section'>
          <div className='explore-grid'>
            {carouselRows.flatMap(row => 
              row.items.map((item, idx) => {
                const movieData = MOVIE_DATABASE.find(m => m.id === item.id)
                return (
                  <Link
                    key={`${row.id}-${item.id}-${idx}`}
                    to={`/movie/${item.id}`}
                    className='media-card'
                  >
                    <div className='media-card-image'>
                      <img 
                        src={movieData?.poster || `https://via.placeholder.com/120x180?text=${encodeURIComponent(item.title)}`} 
                        alt={item.title} 
                        loading='lazy' 
                      />
                    </div>
                    <div className='media-card-info'>
                      <h4>{item.title}</h4>
                      <p>{item.meta}</p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
}
