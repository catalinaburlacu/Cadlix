import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import { useApiQuery } from '../../../hooks/useApiQuery.js'
import { cadlixApi } from '../../../api/cadlixApi.js'
import { mapExplorePayload } from '../../../api/mappers.js'
import SearchBar from './SearchBar.jsx'
import '../home/Home.css'
import './Explore.css'

export default function Explore() {
  const [selectedCategories, setSelectedCategories] = useState([])
  const { data: exploreResponse, loading, error } = useApiQuery(() => cadlixApi.getExplore(), [], null)
  const exploreData = mapExplorePayload(exploreResponse) || { categories: [], carouselRows: [], movieDatabase: [] }
  const carouselRows = exploreData.carouselRows
  const exploreCategories = exploreData.categories
  const movieDbIndex = useMemo(
    () => Object.fromEntries((exploreData.movieDatabase || []).map(m => [m.id, m])),
    [exploreData.movieDatabase]
  )

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const filteredCarouselRows = selectedCategories.length > 0
    ? carouselRows.filter(row => selectedCategories.includes(row.id))
    : carouselRows

  if (error) {
    return (
      <SidebarLayout pageClass='explore-page' navbarContent={<h1 className='explore-heading'>Explore by Categories</h1>}>
        <div className='page-content explore-content'>
          <div className='explore-error'>
            <i className='bx bx-warning-circle'></i>
            <h2>Failed to load explore page</h2>
            <p>Please check your connection and try again.</p>
            <button type='button' className='explore-retry-btn' onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (loading) {
    return (
      <SidebarLayout pageClass='explore-page' navbarContent={<h1 className='explore-heading'>Explore by Categories</h1>}>
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
          <div className='explore-loading'>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className='explore-skeleton-card'>
                <div className='skeleton skeleton-icon'></div>
                <div className='skeleton skeleton-text'></div>
              </div>
            ))}
          </div>
        </div>
      </SidebarLayout>
    )
  }

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
          {exploreCategories.map(category => {
            const isSelected = selectedCategories.includes(category.id)
            return (
              <article
                key={category.id}
                className={`explore-category-card${isSelected ? ' explore-category-card--selected' : ''}`}
                id={category.id}
                onClick={() => toggleCategory(category.id)}
              >
                <div className='explore-card-head'>
                  <div className='explore-card-icon'>
                    <i className={`bx ${category.icon}`}></i>
                  </div>
                  <h3>{category.title}</h3>
                </div>
                <div className='explore-chip-list'>
                  {category.items.map(item => (
                    <button
                      key={item}
                      type='button'
                      className='explore-chip'
                      onClick={e => { e.stopPropagation(); toggleCategory(category.id) }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </section>

        <section className='explore-carousel-section'>
          {filteredCarouselRows.length === 0 ? (
            <div className='explore-empty'>
              <i className='bx bx-search-alt-2'></i>
              <h3>No results</h3>
              <p>Try selecting a different category.</p>
            </div>
          ) : (
            filteredCarouselRows.map(row => (
              <div key={row.id} className='explore-carousel-row'>
                <h2 className='explore-carousel-title'>{row.title}</h2>
                <div className='explore-grid'>
                  {row.items.map((item, idx) => (
                    <Link
                      key={`${row.id}-${item.id}-${idx}`}
                      to={`/movie/${item.id}`}
                      className='media-card'
                    >
                      <div className='media-card-image'>
                        <img 
                          src={movieDbIndex[item.id]?.poster || '/api/media/image/defaults/default-poster.png'} 
                          alt={item.title} 
                          loading='lazy' 
                          onError={e => { e.target.src = '/api/media/image/defaults/default-poster.png' }}
                        />
                      </div>
                      <div className='media-card-info'>
                        <h4>{item.title}</h4>
                        <p>{item.meta}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </SidebarLayout>
  )
}
