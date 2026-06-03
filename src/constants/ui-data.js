export const MAIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bx-grid-alt', path: '/home' },
  { id: 'trending', label: 'Trending', icon: 'bx-trending-up', path: '/trending' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'bx-trophy', path: '/leaderboard' },
  { id: 'explore', label: 'Explore', icon: 'bx-compass', path: '/explore' },
  { id: 'favorites', label: 'Favorites', icon: 'bx-heart', path: '/profile/favorites' },
  { id: 'history', label: 'History', icon: 'bx-history', path: '/history' },
]

export const SETTINGS_NAV_ITEMS = [
  { id: 'settings', label: 'Settings', icon: 'bx-cog', path: '/settings' },
  { id: 'help', label: 'Help & Support', icon: 'bx-help-circle', path: '#help' },
]

export const SOCIAL_PROVIDERS = [
  { name: 'Google', icon: 'bxl-google' },
  { name: 'Facebook', icon: 'bxl-facebook' },
  { name: 'Apple', icon: 'bxl-apple' },
]

export const ACCEPTED_ISSUERS = [
  { name: 'ING Bank', icon: 'ING' },
  { name: 'Raiffeisen Bank', icon: 'RIF' },
  { name: 'CEC Bank', icon: 'CEC' },
  { name: 'BRD', icon: 'BRD' },
  { name: 'Banca Transilvania', icon: 'BT' },
  { name: 'BCR', icon: 'BCR' },
  { name: 'Revolut', icon: 'REV' },
]

export const CARD_SCHEMES = [
  { name: 'Visa', pattern: '^4\\d{12}(?:\\d{3})?(?:\\d{3})?$', lengths: [13, 16, 19], cvvLengths: [3], luhn: true },
  { name: 'Mastercard', pattern: '^(?:5[1-5]\\d{14}|2(?:2[2-9]|[3-6]\\d|7[01])\\d{12}|2720\\d{12})$', lengths: [16], cvvLengths: [3], luhn: true },
]

export const SETTINGS_SECTIONS = [
  { id: 'playback', label: 'Playback', icon: 'bx-play-circle' },
  { id: 'notifications', label: 'Notifications', icon: 'bx-bell' },
  { id: 'privacy', label: 'Privacy', icon: 'bx-lock' },
  { id: 'appearance', label: 'Appearance', icon: 'bx-palette' },
  { id: 'security', label: 'Security', icon: 'bx-shield' },
]

export const DEFAULT_SETTINGS = {
  playback: { quality: 'auto', autoplay: true, skipIntro: false, subtitleLang: 'off' },
  notifications: { newReleases: true, recommendations: true, accountActivity: true, promotions: false },
  privacy: { profileVisibility: 'public', trackHistory: true, shareActivity: false, allowDataCollection: true },
  appearance: { language: 'en', region: 'us', subtitleSize: 'medium' },
}

export const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free', subtitle: 'Plan GRATIS', price: 0, cta: 'Get Started', features: ['Acces la o parte din catalog (titluri selectate)', 'Calitate video 480p - 720p'] },
  { id: 'standard', name: 'Standard', subtitle: 'Plan MEDIU', price: 399, cta: 'Upgrade Now', features: ['Acces complet la catalog', 'Calitate Full HD (1080p)'] },
  { id: 'premium', name: 'Premium', subtitle: 'Plan PREMIUM', price: 999, cta: 'Go Premium', features: ['Tot ce include Standard', '4K Ultra HD'] },
]

export const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: 'bx-grid-alt' },
  { id: 'users', label: 'Users', icon: 'bx-user' },
  { id: 'content', label: 'Content', icon: 'bx-movie' },
  { id: 'reviews', label: 'Reviews', icon: 'bx-star' },
  { id: 'reports', label: 'Reports', icon: 'bx-flag' },
]
