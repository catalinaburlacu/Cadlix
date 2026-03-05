export const SIDEBAR_STORAGE_KEY = 'cadlix_sidebar_state';

export const MAIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bx-grid-alt', path: '/home' },
  { id: 'trending', label: 'Trending', icon: 'bx-trending-up', path: '/trending' },
  { id: 'explore', label: 'Explore', icon: 'bx-compass', path: '/explore' },
  { id: 'favorites', label: 'Favorites', icon: 'bx-heart', path: '/profile/favorites' },
  { id: 'history', label: 'History', icon: 'bx-history', path: '/history' },
];

export const SETTINGS_NAV_ITEMS = [
  { id: 'settings', label: 'Settings', icon: 'bx-cog', path: '/settings' },
  { id: 'help', label: 'Help & Support', icon: 'bx-help-circle', path: '#help' },
];
