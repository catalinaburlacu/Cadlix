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
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'ona', label: 'ONA' },
  { value: 'special', label: 'Special' },
];

// Anime Genres
export const ANIME_GENRES = [
  { value: '', label: 'All Genres' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'slice-of-life', label: 'Slice of Life' },
  { value: 'sports', label: 'Sports' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'thriller', label: 'Thriller' },
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
};
