/**
 * Application Constants
 */

// Tabs Configuration
export const CONTENT_TABS = [
  { id: 'watching', label: 'Watching' },
  { id: 'planned', label: 'Planned' },
  { id: 'completed', label: 'Completed' },
  { id: 'dropped', label: 'Dropped' },
  { id: 'favorites', label: 'Favorites' },
];

// Content Types
export const CONTENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'movie', label: 'Movie' },
  { value: 'tv', label: 'TV Series' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'miniseries', label: 'Mini-Series' },
  { value: 'special', label: 'Special' },
];

// Content Genres
export const CONTENT_GENRES = [
  { value: '', label: 'All Genres' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'crime', label: 'Crime' },
  { value: 'detective', label: 'Detective' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'historical', label: 'Historical' },
  { value: 'horror', label: 'Horror' },
  { value: 'military', label: 'Military' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'psychological', label: 'Psychological' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'sports', label: 'Sports' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'biography', label: 'Biography' },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: '', label: 'Sort By' },
  { value: 'title', label: 'Title' },
  { value: 'score', label: 'Score' },
  { value: 'date', label: 'Date Added' },
  { value: 'duration', label: 'Duration' },
];

// Default User Data
export const DEFAULT_USER_DATA = {
  id: 1,
  username: 'DefaultUser',
  email: 'user@cadlix.com',
  avatar: 'https://via.placeholder.com/120x120?text=Avatar',
  group: 'Member',
  status: 'Online',
  stats: {
    rating: '4.5',
    titlesWatched: 42,
    comments: 15,
    likesGiven: 128,
    likesReceived: 256,
    hoursWatched: 168,
    addedToList: 67,
    daysOnSite: 30,
  },
  watchHistory: [
    {
      id: 'h-1',
      title: 'The Last of Us',
      category: 'Series',
      series: 'Season 1',
      episode: 'Episode 4',
      watchedAt: '2026-02-17T21:42:00Z',
      progress: '44:12',
    },
    {
      id: 'h-2',
      title: 'Dune: Part Two',
      category: 'Movie',
      series: '-',
      episode: '-',
      watchedAt: '2026-02-16T20:05:00Z',
      progress: '01:58:11',
    },
    {
      id: 'h-3',
      title: 'Stranger Things',
      category: 'Series',
      series: 'Season 4',
      episode: 'Episode 5',
      watchedAt: '2026-02-15T19:30:00Z',
      progress: '42:10',
    },
    {
      id: 'h-4',
      title: 'Peaky Blinders',
      category: 'Series',
      series: 'Season 5',
      episode: 'Episode 3',
      watchedAt: '2026-02-14T22:18:00Z',
      progress: '52:00',
    },
  ],
};
