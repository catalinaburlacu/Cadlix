import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import type { MediaItem, WatchListItem } from '@/types'
import Button from '../../../components/common/Button'
import SidebarLayout from '../../../components/layout/SidebarLayout'
import { useUser } from '../../../context/useUser'
import {
  CATEGORY_NAV_ITEMS,
  FEATURED,
  TRENDING_ROW,
  NEW_RELEASES,
  TOP_RATED,
} from '../../../mocks/home'
import './Home.css'

interface CardProps {
  item: MediaItem | WatchListItem
}

interface ContentRowProps {
  title: string
  icon: string
  items: (MediaItem | WatchListItem)[]
  link?: string
  CardComponent?: React.ComponentType<CardProps>
}

function TopNav() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const onTrending = location.pathname === '/trending'
  const currentFilter = searchParams.get('filter') || 'all'

  function isActive(item: { id: string; label: string; to: string; filter: string | null }) {
    if (item.id === 'home') return location.pathname === '/home'
    if (!onTrending) return false
    return currentFilter === item.filter
  }

  return (
    <nav className='nav-menu' aria-label='Category navigation'>
      <ul className='nav-menu-list'>
        {CATEGORY_NAV_ITEMS.map(item => (
          <li key={item.id}>
            <Link to={item.to} className={`nav-menu-link${isActive(item) ? ' active' : ''}`}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RowCard({ item }: CardProps) {
  const media = item as MediaItem
  return (
    <div className='row-card'>
      <div className='row-card-poster-wrap'>
        <img className='row-card-poster' src={media.poster} alt={media.title} loading='lazy' />
        <div className='row-card-overlay' aria-hidden='true'>
          <span className='row-card-play-btn'>
            <i className='bx bx-play'></i>
          </span>
        </div>
        <span className='row-card-score'>
          <i className='bx bxs-star'></i>
          {media.score}
        </span>
        <span className='row-card-type-badge'>{media.type === 'tv' ? 'Series' : 'Movie'}</span>
      </div>
      <div className='row-card-body'>
        <span className='row-card-title'>{media.title}</span>
        <span className='row-card-meta'>
          {media.genre} · {media.year}
        </span>
      </div>
    </div>
  )
}

function ContinueCard({ item }: CardProps) {
  const watchItem = item as WatchListItem
  const progress = 45
  return (
    <div className='continue-card'>
      <div className='continue-card-thumb-wrap'>
        <img className='continue-card-thumb' src={watchItem.poster} alt={watchItem.title} loading='lazy' />
        <div className='continue-card-overlay' aria-hidden='true'>
          <span className='continue-card-play-btn'>
            <i className='bx bx-play'></i>
          </span>
        </div>
        {watchItem.episode && watchItem.episode !== '-' && (
          <span className='continue-card-episode'>{watchItem.episode}</span>
        )}
        <div className='continue-progress-bar'>
          <div className='continue-progress-fill' style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className='continue-card-body'>
        <span className='continue-card-title'>{watchItem.title}</span>
        <span className='continue-card-meta'>{watchItem.genre}</span>
      </div>
    </div>
  )
}

function ContentRow({ title, icon, items, link, CardComponent = RowCard }: ContentRowProps) {
  return (
    <section className='content-row'>
      <div className='content-row-header'>
        <h2 className='content-row-title'>
          <i className={`bx ${icon}`} aria-hidden='true'></i>
          {title}
        </h2>
        {link && (
          <Link to={link} className='content-row-see-all'>
            See All <i className='bx bx-chevron-right'></i>
          </Link>
        )}
      </div>
      <div className='content-row-scroll'>
        {items.map(item => (
          <CardComponent key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUser()

  const continueWatching = user?.watchList?.filter(i => i.status === 'watching') ?? []

  return (
    <SidebarLayout navbarContent={<TopNav />}>
      <div className='home-dashboard'>
        {/* ── Featured Banner ── */}
        <section className='featured-banner' aria-label='Featured content'>
          <img className='featured-backdrop' src={FEATURED.poster} alt='' aria-hidden='true' />
          <div className='featured-gradient' aria-hidden='true' />
          <div className='featured-info'>
            <div className='featured-badges'>
              <span className='featured-badge featured-badge--type'>
                {FEATURED.type === 'tv' ? 'Series' : 'Movie'}
              </span>
              <span className='featured-badge featured-badge--meta'>{FEATURED.genre}</span>
              <span className='featured-badge featured-badge--meta'>{FEATURED.year}</span>
            </div>
            <h1 className='featured-title'>{FEATURED.title}</h1>
            <p className='featured-desc'>{FEATURED.description}</p>
            <div className='featured-stats'>
              <span className='featured-stat featured-stat--score'>
                <i className='bx bxs-star' aria-hidden='true'></i>
                {FEATURED.score}
              </span>
              <span className='featured-stat featured-stat--views'>
                <i className='bx bx-show' aria-hidden='true'></i>
                {FEATURED.views} views
              </span>
            </div>
            <div className='featured-actions'>
              <Button variant='primary' size='large'>
                <i className='bx bx-play' aria-hidden='true'></i>
                Watch Now
              </Button>
              <Button variant='ghost' size='large'>
                <i className='bx bx-plus' aria-hidden='true'></i>
                Add to List
              </Button>
            </div>
          </div>
        </section>

        <div className='home-rows'>
          {/* ── Continue Watching ── */}
          {isAuthenticated && continueWatching.length > 0 && (
            <ContentRow
              title='Continue Watching'
              icon='bx-time-five'
              items={continueWatching}
              link='/profile'
              CardComponent={ContinueCard}
            />
          )}

          {/* ── Trending Now ── */}
          <ContentRow
            title='Trending Now'
            icon='bx-trending-up'
            items={TRENDING_ROW}
            link='/trending'
          />

          {/* ── New Releases ── */}
          <ContentRow
            title='New Releases'
            icon='bx-star'
            items={NEW_RELEASES}
            link='/trending?filter=all'
          />

          {/* ── Top Rated ── */}
          <ContentRow title='Top Rated' icon='bx-award' items={TOP_RATED} />

          {/* ── Guest CTA ── */}
          {!isAuthenticated && (
            <section className='home-cta'>
              <div className='home-cta-inner'>
                <i className='bx bx-play-circle home-cta-icon' aria-hidden='true'></i>
                <h2 className='home-cta-title'>Start Watching Today</h2>
                <p className='home-cta-desc'>
                  Sign in to track your watchlist, get personalised recommendations, and pick up
                  exactly where you left off.
                </p>
                <Button variant='primary' size='large' onClick={() => navigate('/login')}>
                  Sign In to Your Account
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
