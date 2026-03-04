import { useParams, useNavigate, Link } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import Button from '../../../components/common/Button.jsx'
import { TRENDING_ROW, NEW_RELEASES, TOP_RATED } from '../../../mocks/home.js'
import './MovieDetails.css'

const ALL_MOVIES = [...TRENDING_ROW, ...NEW_RELEASES, ...TOP_RATED]

const MOCK_MOVIE_DETAILS = {
  'tr-1': {
    id: 'tr-1',
    title: 'The Last of Us',
    type: 'tv',
    year: 2023,
    country: 'United States',
    genre: 'Drama',
    director: 'Craig Mazin, Neil Druckmann',
    cast: 'Pedro Pascal, Bella Ramsey, Gabriel Luna, Merle Dandridge',
    duration: '9 episodes (Season 1)',
    rating: 9.2,
    description:
      'A hardened survivor and a teenage girl traverse a post-apocalyptic world filled with infected and ruthless survivors fighting for dominance and survival.',
    poster: 'https://via.placeholder.com/300x450/1a1a2e/e0e0e0?text=TLOU',
    backdrop: 'https://via.placeholder.com/1280x520/0d0d1e/3a3a5c?text=The+Last+of+Us',
  },
  'tr-2': {
    id: 'tr-2',
    title: 'Oppenheimer',
    type: 'movie',
    year: 2023,
    country: 'United States, United Kingdom',
    genre: 'Drama',
    director: 'Christopher Nolan',
    cast: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
    duration: '180 min',
    rating: 8.9,
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    poster: 'https://via.placeholder.com/300x450/1a1a2e/e0e0e0?text=OPP',
    backdrop: 'https://via.placeholder.com/1280x520/0d0d1e/3a3a5c?text=Oppenheimer',
  },
}

function getMovieDetails(movieId) {
  if (MOCK_MOVIE_DETAILS[movieId]) {
    return MOCK_MOVIE_DETAILS[movieId]
  }

  const movie = ALL_MOVIES.find(m => m.id === movieId)
  if (movie) {
    return {
      ...movie,
      country: 'United States',
      director: 'Unknown Director',
      cast: 'Cast Member 1, Cast Member 2, Cast Member 3',
      duration: movie.type === 'tv' ? '10 episodes' : '120 min',
      description:
        'A thrilling story that keeps you on the edge of your seat. Experience the drama, action, and emotion in this groundbreaking title.',
    }
  }
  return null
}

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = getMovieDetails(id)

  if (!movie) {
    return (
      <SidebarLayout>
        <div className='movie-details-error'>
          <h2>Movie not found</h2>
          <p>The movie you're looking for doesn't exist.</p>
          <Button variant='primary' onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className='movie-details'>
        <div className='movie-details-backdrop'>
          <img src={movie.backdrop || movie.poster} alt='' aria-hidden='true' />
          <div className='movie-details-backdrop-gradient' />
        </div>

        <div className='movie-details-content'>
          <div className='movie-details-poster'>
            <img src={movie.poster} alt={movie.title} />
          </div>

          <div className='movie-details-info'>
            <div className='movie-details-badges'>
              <span className='movie-details-badge movie-details-badge--type'>
                {movie.type === 'tv' ? 'Series' : 'Movie'}
              </span>
              <span className='movie-details-badge movie-details-badge--genre'>{movie.genre}</span>
            </div>

            <h1 className='movie-details-title'>{movie.title}</h1>

            <div className='movie-details-meta'>
              <span className='movie-details-meta-item'>
                <i className='bx bx-calendar'></i>
                {movie.year}
              </span>
              <span className='movie-details-meta-item'>
                <i className='bx bx-globe'></i>
                {movie.country}
              </span>
              <span className='movie-details-meta-item'>
                <i className='bx bx-time'></i>
                {movie.duration}
              </span>
            </div>

            <div className='movie-details-rating'>
              <i className='bx bxs-star'></i>
              <span className='movie-details-rating-value'>{movie.rating}</span>
              <span className='movie-details-rating-label'>Rating</span>
            </div>

            <div className='movie-details-actions'>
              <Link to={`/watch/${movie.id}`} className='btn btn-primary btn-large'>
                <i className='bx bx-play'></i>
                Watch Now
              </Link>
              <Button variant='ghost' size='large'>
                <i className='bx bx-plus'></i>
                Add to List
              </Button>
            </div>

            <div className='movie-details-description'>
              <h3>Synopsis</h3>
              <p>{movie.description}</p>
            </div>

            <div className='movie-details-section'>
              <h3>Director</h3>
              <p>{movie.director}</p>
            </div>

            <div className='movie-details-section'>
              <h3>Cast</h3>
              <p>{movie.cast}</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
