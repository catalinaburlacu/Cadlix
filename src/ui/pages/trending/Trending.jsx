import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx';
import Button from '../../../components/common/Button.jsx';
import './Trending.css';

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'Series' },
  { id: 'documentary', label: 'Documentaries' },
];

const TRENDING_DATA = [
  {
    id: 't-1', rank: 1, title: 'The Last of Us', type: 'tv', genre: 'Drama',
    year: 2023, score: 9.2, views: '2.4M', trendPct: '+18%',
    description: 'A hardened survivor and a teenage girl traverse a post-apocalyptic world filled with infected and ruthless survivors fighting for dominance.',
    thumb: 'https://via.placeholder.com/160x225/1a1a2e/e0e0e0?text=TLOU',
  },
  {
    id: 't-2', rank: 2, title: 'Oppenheimer', type: 'movie', genre: 'Drama',
    year: 2023, score: 8.9, views: '1.9M', trendPct: '+12%',
    description: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=OPP',
  },
  {
    id: 't-3', rank: 3, title: 'Severance', type: 'tv', genre: 'Thriller',
    year: 2022, score: 8.7, views: '1.7M', trendPct: '+31%',
    description: 'Employees have their work and personal memories surgically separated, until one of them begins to question their bifurcated existence.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=SEV',
  },
  {
    id: 't-4', rank: 4, title: 'Dune: Part Two', type: 'movie', genre: 'Sci-Fi',
    year: 2024, score: 8.5, views: '1.5M', trendPct: '+9%',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=Dune',
  },
  {
    id: 't-5', rank: 5, title: 'The Bear', type: 'tv', genre: 'Drama',
    year: 2022, score: 8.6, views: '1.3M', trendPct: '+22%',
    description: "A young chef from the fine-dining world returns to Chicago to run his family's sandwich shop after a family tragedy.",
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=Bear',
  },
  {
    id: 't-6', rank: 6, title: 'Succession', type: 'tv', genre: 'Drama',
    year: 2018, score: 9.0, views: '1.1M', trendPct: '+6%',
    description: 'The Roy family controls one of the biggest media conglomerates in the world. Their battle for power tears the family apart.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=Succ',
  },
  {
    id: 't-7', rank: 7, title: 'Poor Things', type: 'movie', genre: 'Fantasy',
    year: 2023, score: 8.0, views: '0.9M', trendPct: '+14%',
    description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by an eccentric scientist.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=PT',
  },
  {
    id: 't-8', rank: 8, title: 'Fallout', type: 'tv', genre: 'Sci-Fi',
    year: 2024, score: 8.5, views: '0.8M', trendPct: '+41%',
    description: 'A sheltered young woman from a Vault emerges into the wasteland of post-apocalyptic Los Angeles and discovers a broken world.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=FALL',
  },
  {
    id: 't-9', rank: 9, title: 'Peaky Blinders', type: 'tv', genre: 'Crime',
    year: 2013, score: 8.9, views: '0.7M', trendPct: '+5%',
    description: 'A gangster family epic set in 1920s Birmingham, England, centered on the Shelby crime family.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=PB',
  },
  {
    id: 't-10', rank: 10, title: 'Killers of the Flower Moon', type: 'movie', genre: 'Crime',
    year: 2023, score: 7.6, views: '0.6M', trendPct: '+3%',
    description: 'Members of the Osage Nation are murdered under mysterious circumstances in 1920s Oklahoma, sparking a major FBI investigation.',
    thumb: 'https://via.placeholder.com/60x85/1a1a2e/e0e0e0?text=KOTM',
  },
];

export default function Trending() {
  const [period, setPeriod] = useState('today');
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  function setFilter(value) {
    setSearchParams(value === 'all' ? {} : { filter: value });
  }

  const hero = TRENDING_DATA[0];

  const filtered = useMemo(() => {
    const rest = TRENDING_DATA.slice(1);
    if (filter === 'all') return rest;
    return rest.filter(item => item.type === filter);
  }, [filter]);

  return (
    <SidebarLayout>
      <div className="trending-page">

        {/* Header */}
        <div className="trending-header">
          <div className="trending-title-block">
            <i className="bx bx-trending-up trending-page-icon" aria-hidden="true"></i>
            <h1 className="trending-page-title">Trending</h1>
          </div>
          <div className="period-tabs" role="tablist" aria-label="Trending period">
            {PERIODS.map(p => (
              <button
                key={p.id}
                role="tab"
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
        <div className="trending-hero">
          <div className="hero-watermark">#1</div>
          <div className="hero-thumb-wrap">
            <img className="hero-thumb" src={hero.thumb} alt={hero.title} />
          </div>
          <div className="hero-info">
            <div className="hero-badges">
              <span className="hero-type-badge">
                {hero.type === 'tv' ? 'Series' : 'Movie'}
              </span>
              <span className="hero-genre-badge">{hero.genre}</span>
              <span className="hero-year-badge">{hero.year}</span>
            </div>
            <h2 className="hero-name">{hero.title}</h2>
            <p className="hero-desc">{hero.description}</p>
            <div className="hero-stats">
              <span className="hero-stat hero-score">
                <i className="bx bxs-star" aria-hidden="true"></i>
                {hero.score}
              </span>
              <span className="hero-stat hero-views">
                <i className="bx bx-show" aria-hidden="true"></i>
                {hero.views} views
              </span>
              <span className="hero-stat hero-trend">
                <i className="bx bx-trending-up" aria-hidden="true"></i>
                {hero.trendPct} this week
              </span>
            </div>
            <div className="hero-actions">
              <Button variant="primary">
                <i className="bx bx-play" aria-hidden="true"></i>
                Watch Now
              </Button>
              <Button variant="ghost">
                <i className="bx bx-plus" aria-hidden="true"></i>
                Add to List
              </Button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="trending-filter-bar">
          <div className="filter-tabs" role="tablist" aria-label="Content type filter">
            {FILTERS.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`filter-tab${filter === f.id ? ' active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="filter-count">
            {filtered.length} title{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Ranked grid */}
        {filtered.length === 0 ? (
          <div className="trending-empty">
            <i className="bx bx-search-alt" aria-hidden="true"></i>
            <p>No titles found for this filter.</p>
          </div>
        ) : (
          <div className="trending-grid">
            {filtered.map(item => (
              <div key={item.id} className="trending-card">
                <div className="trending-card-poster-wrap">
                  <img
                    className="trending-card-poster"
                    src={item.thumb}
                    alt={item.title}
                    loading="lazy"
                  />
                  <span className="trending-card-rank">#{item.rank}</span>
                  <span className="trending-card-trend">
                    <i className="bx bx-trending-up" aria-hidden="true"></i>
                    {item.trendPct}
                  </span>
                </div>
                <div className="trending-card-body">
                  <span className="trending-card-title">{item.title}</span>
                  <div className="trending-card-meta">
                    <span className="trending-card-score">
                      <i className="bx bxs-star" aria-hidden="true"></i>
                      {item.score}
                    </span>
                    <span className="trending-card-genre">{item.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
