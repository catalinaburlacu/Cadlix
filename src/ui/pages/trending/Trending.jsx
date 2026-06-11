import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import Button from '../../../components/common/Button.jsx'
import { useApiQuery } from '../../../hooks/useApiQuery.js'
import { cadlixApi } from '../../../api/cadlixApi.js'
import { mapTrendingPayload } from '../../../api/mappers.js'
import './Trending.css'

export default function Trending() {
  const [period, setPeriod] = useState('week')
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'all'

  const periodSuffix = { today: 'today', week: 'this week', month: 'this month' }

  const fetchTrending = useCallback(
    signal => cadlixApi.getTrending(period, filter, signal),
    [period, filter]
  )
  const { data: trendingResponse } = useApiQuery(fetchTrending, [period, filter], null)
  const trendingData = mapTrendingPayload(trendingResponse) || { periods: [], filters: [], data: [] }

  const setFilter = useCallback(value => {
    setSearchParams(value === 'all' ? {} : { filter: value })
  }, [setSearchParams])

  const hero = trendingData.data[0] || null

  const filtered = useMemo(() => {
    return trendingData.data.slice(1)
  }, [trendingData.data])

  return (
    <SidebarLayout>
      <div className='trending-page'>
        {/* Header */}
        <div className='trending-header'>
          <div className='trending-title-block'>
            <i className='bx bx-trending-up trending-page-icon' aria-hidden='true'></i>
            <h1 className='trending-page-title'>Trending</h1>
          </div>
          <div className='period-tabs' role='tablist' aria-label='Trending period'>
            {trendingData.periods.map(p => (
              <button
                key={p.id}
                role='tab'
                aria-selected={period === p.id}
                className={`period-tab${period === p.id ? ' active' : ''}`}
                onClick={() => setPeriod(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero — #1 */}
        {hero && (
          <div className='trending-hero'>
            <div className='hero-watermark'>#1</div>
            <div className='hero-thumb-wrap'>
              <img className='hero-thumb' src={hero.thumb || '/api/media/image/defaults/default-poster.png'} alt={hero.title} onError={e => { e.target.src = '/api/media/image/defaults/default-poster.png' }} />
            </div>
            <div className='hero-info'>
              <div className='hero-badges'>
                <span className='hero-type-badge'>{hero.type === 'tv' ? 'Series' : 'Movie'}</span>
                <span className='hero-genre-badge'>{hero.genre}</span>
                <span className='hero-year-badge'>{hero.year}</span>
              </div>
              <h2 className='hero-name'>{hero.title}</h2>
              <p className='hero-desc'>{hero.description}</p>
              <div className='hero-stats'>
                <span className='hero-stat hero-score'>
                  <i className='bx bxs-star' aria-hidden='true'></i>
                  {hero.score}
                </span>
                <span className='hero-stat hero-views'>
                  <i className='bx bx-show' aria-hidden='true'></i>
                  {hero.views} views
                </span>
                <span className='hero-stat hero-trend'>
                  <i className='bx bx-trending-up' aria-hidden='true'></i>
                  {hero.trendPct} {periodSuffix[period] || 'this week'}
                </span>
              </div>
              <div className='hero-actions'>
                <Button variant='primary'>
                  <i className='bx bx-play' aria-hidden='true'></i>
                  Watch Now
                </Button>
                <Button variant='ghost'>
                  <i className='bx bx-plus' aria-hidden='true'></i>
                  Add to List
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className='trending-filter-bar'>
          <div className='filter-tabs' role='tablist' aria-label='Content type filter'>
            {trendingData.filters.map(f => (
              <button
                key={f.id}
                role='tab'
                aria-selected={filter === f.id}
                className={`filter-tab${filter === f.id ? ' active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className='filter-count'>
            {filtered.length} title{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Ranked grid */}
        {filtered.length === 0 ? (
          <div className='trending-empty'>
            <i className='bx bx-search-alt' aria-hidden='true'></i>
            <p>No titles found for this filter.</p>
          </div>
        ) : (
          <div className='trending-grid'>
            {filtered.map(item => (
              <Link key={item.id} to={`/movie/${item.id}`} className='trending-card'>
                <div className='trending-card-poster-wrap'>
                  <img
                    className='trending-card-poster'
                    src={item.thumb || '/api/media/image/defaults/default-poster.png'}
                    alt={item.title}
                    loading='lazy'
                    onError={e => { e.target.src = '/api/media/image/defaults/default-poster.png' }}
                  />
                  <span className='trending-card-rank'>#{item.rank}</span>
                  <span className='trending-card-trend'>
                    <i className='bx bx-trending-up' aria-hidden='true'></i>
                    {item.trendPct}
                  </span>
                </div>
                <div className='trending-card-body'>
                  <span className='trending-card-title'>{item.title}</span>
                  <div className='trending-card-meta'>
                    <span className='trending-card-score'>
                      <i className='bx bxs-star' aria-hidden='true'></i>
                      {item.score}
                    </span>
                    <span className='trending-card-genre'>{item.genre}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
