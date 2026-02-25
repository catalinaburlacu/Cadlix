/**
 * Application Constants
 */

// App Configuration
export const APP_CONFIG = {
  name: 'Cadlix',
  version: '1.0.0',
  description: 'Manage your anime collection and track your progress',
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  EXPLORE: '/explore',
  PROFILE: '/profile',
  HISTORY: '/history',
  VIDEO: '/video',
  ROOT: '/',
};

// User Groups
export const USER_GROUPS = {
  MEMBER: 'Member',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
};

// User Status
export const USER_STATUS = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  AWAY: 'Away',
  BUSY: 'Busy',
};

// Tabs Configuration
export const CONTENT_TABS = [
  { id: 'watching', label: 'Watching' },
  { id: 'planned', label: 'Planned' },
  { id: 'completed', label: 'Completed' },
  { id: 'dropped', label: 'Dropped' },
  { id: 'favorites', label: 'Favorites' },
];

// Anime Types
export const ANIME_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'anime', label: 'Anime' },
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'ona', label: 'ONA' },
  { value: 'special', label: 'Special' },
];

// Anime Genres
export const ANIME_GENRES = [
  { value: '', label: 'All Genres' },
  { value: 'martial-arts', label: 'Martial Arts' },
  { value: 'military', label: 'Military' },
  { value: 'harem', label: 'Harem' },
  { value: 'detective', label: 'Detective' },
  { value: 'drama', label: 'Drama' },
  { value: 'games', label: 'Games' },
  { value: 'historical', label: 'Historical' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'magic', label: 'Magic' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'slice-of-life', label: 'Slice of Life' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'psychological', label: 'Psychological' },
  { value: 'romance', label: 'Romance' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'sports', label: 'Sports' },
  { value: 'super-power', label: 'Super Power' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'horror', label: 'Horror' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'school', label: 'School' },
  { value: 'action', label: 'Action' },
  { value: 'ecchi', label: 'Ecchi' },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: '', label: 'Sort By' },
  { value: 'title', label: 'Title' },
  { value: 'score', label: 'Score' },
  { value: 'date', label: 'Date Added' },
  { value: 'episodes', label: 'Episodes' },
];

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`,
  password: {
    minLength: 'Password must be at least 8 characters long',
    uppercase: 'Password must contain at least one uppercase letter',
    lowercase: 'Password must contain at least one lowercase letter',
    number: 'Password must contain at least one number',
    special: 'Password must contain at least one special character',
  },
};

// Toast Messages
export const TOAST_MESSAGES = {
  login: {
    success: 'Welcome back! Login successful',
    error: 'Login failed. Please check your credentials and try again.',
  },
  signup: {
    success: 'Account created successfully! Welcome to Cadlix',
    error: 'Signup failed. Please try again.',
  },
  logout: {
    success: 'Logged out successfully',
    error: 'Logout failed',
  },
  form: {
    error: 'Please fix the errors in the form',
  },
};

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// Mock media library
export const MOCK_MEDIA_LIBRARY = [
  { id: 'm-1', title: 'Attack on Titan', category: 'Anime', type: 'tv', genre: 'action', score: 9.1, dateAdded: '2026-02-11', status: 'watching', season: 'Final Season', episode: 'Episode 7', progress: '18:27' },
  { id: 'm-2', title: 'Jujutsu Kaisen', category: 'Anime', type: 'tv', genre: 'supernatural', score: 8.7, dateAdded: '2026-02-10', status: 'planned', season: 'Season 2', episode: 'Episode 1', progress: '00:00' },
  { id: 'm-3', title: 'Demon Slayer', category: 'Anime', type: 'tv', genre: 'action', score: 8.8, dateAdded: '2026-02-09', status: 'completed', season: 'Hashira Training Arc', episode: 'Episode 8', progress: '24:00' },
  { id: 'm-4', title: 'Your Name', category: 'Anime', type: 'movie', genre: 'romance', score: 8.4, dateAdded: '2026-02-08', status: 'favorites', season: '-', episode: '-', progress: '01:46:00' },
  { id: 'm-5', title: 'Dune: Part Two', category: 'Movie', type: 'movie', genre: 'sci-fi', score: 8.6, dateAdded: '2026-02-07', status: 'completed', season: '-', episode: '-', progress: '02:46:00' },
  { id: 'm-6', title: 'Interstellar', category: 'Movie', type: 'movie', genre: 'drama', score: 8.9, dateAdded: '2026-02-06', status: 'favorites', season: '-', episode: '-', progress: '02:49:00' },
  { id: 'm-7', title: 'The Batman', category: 'Movie', type: 'movie', genre: 'thriller', score: 7.9, dateAdded: '2026-02-05', status: 'dropped', season: '-', episode: '-', progress: '00:42:10' },
  { id: 'm-8', title: 'Stranger Things', category: 'Series', type: 'tv', genre: 'mystery', score: 8.2, dateAdded: '2026-02-04', status: 'watching', season: 'Season 4', episode: 'Episode 6', progress: '41:18' },
  { id: 'm-9', title: 'Breaking Bad', category: 'Series', type: 'tv', genre: 'thriller', score: 9.5, dateAdded: '2026-02-03', status: 'completed', season: 'Season 5', episode: 'Episode 16', progress: '47:10' },
  { id: 'm-10', title: 'Dark', category: 'Series', type: 'tv', genre: 'sci-fi', score: 8.8, dateAdded: '2026-02-02', status: 'planned', season: 'Season 1', episode: 'Episode 1', progress: '00:00' },
  { id: 'm-11', title: 'One Punch Man', category: 'Anime', type: 'tv', genre: 'comedy', score: 8.6, dateAdded: '2026-02-01', status: 'watching', season: 'Season 2', episode: 'Episode 4', progress: '16:40' },
  { id: 'm-12', title: 'Money Heist', category: 'Series', type: 'tv', genre: 'adventure', score: 8.1, dateAdded: '2026-01-31', status: 'favorites', season: 'Part 4', episode: 'Episode 2', progress: '52:03' },
];

export const MOCK_VIDEOS = [
  {
    id: 'm-1',
    title: 'Attack on Titan',
    category: 'Anime',
    type: 'tv',
    genre: 'action',
    series: 'Final Season',
    episode: 'Episode 7',
    durationSec: 1440,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://placehold.co/320x180/1a1f5c/ffffff?text=Attack+on+Titan',
  },
  {
    id: 'm-2',
    title: 'Jujutsu Kaisen',
    category: 'Anime',
    type: 'tv',
    genre: 'supernatural',
    series: 'Season 2',
    episode: 'Episode 1',
    durationSec: 1420,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://placehold.co/320x180/25165e/ffffff?text=Jujutsu+Kaisen',
  },
  {
    id: 'm-5',
    title: 'Dune: Part Two',
    category: 'Movie',
    type: 'movie',
    genre: 'sci-fi',
    series: '-',
    episode: '-',
    durationSec: 9960,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: 'https://placehold.co/320x180/2a1a62/ffffff?text=Dune+Part+Two',
  },
  {
    id: 'm-8',
    title: 'Stranger Things',
    category: 'Series',
    type: 'tv',
    genre: 'mystery',
    series: 'Season 4',
    episode: 'Episode 6',
    durationSec: 3100,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://placehold.co/320x180/1d2467/ffffff?text=Stranger+Things',
  },
  {
    id: 'm-9',
    title: 'Breaking Bad',
    category: 'Series',
    type: 'tv',
    genre: 'thriller',
    series: 'Season 5',
    episode: 'Episode 16',
    durationSec: 2830,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://placehold.co/320x180/2e1d65/ffffff?text=Breaking+Bad',
  },
  {
    id: 'm-11',
    title: 'One Punch Man',
    category: 'Anime',
    type: 'tv',
    genre: 'comedy',
    series: 'Season 2',
    episode: 'Episode 4',
    durationSec: 1460,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://placehold.co/320x180/3b1f70/ffffff?text=One+Punch+Man',
  },
];

// Default User Data
export const DEFAULT_USER_DATA = {
  id: 1,
  username: 'DefaultUser',
  email: 'user@cadlix.com',
  avatar: 'https://via.placeholder.com/120x120?text=Avatar',
  group: USER_GROUPS.MEMBER,
  status: USER_STATUS.ONLINE,
  stats: {
    rating: '4.5',
    animeWatched: 42,
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
      mediaId: 'm-2',
      title: 'Jujutsu Kaisen',
      category: 'Anime',
      series: 'Season 2',
      episode: 'Episode 14',
      watchedAt: '2026-02-17T21:42:00Z',
      progress: '18:27',
    },
    {
      id: 'h-2',
      mediaId: 'm-5',
      title: 'Dune: Part Two',
      category: 'Movie',
      series: '-',
      episode: '-',
      watchedAt: '2026-02-16T20:05:00Z',
      progress: '01:58:11',
    },
    {
      id: 'h-3',
      mediaId: 'm-8',
      title: 'Stranger Things',
      category: 'Series',
      series: 'Season 4',
      episode: 'Episode 5',
      watchedAt: '2026-02-15T19:30:00Z',
      progress: '42:10',
    },
    {
      id: 'h-4',
      mediaId: 'm-1',
      title: 'Attack on Titan',
      category: 'Anime',
      series: 'Final Season',
      episode: 'Episode 3',
      watchedAt: '2026-02-14T22:18:00Z',
      progress: '24:00',
    },
  ],
  watchList: MOCK_MEDIA_LIBRARY,
};
