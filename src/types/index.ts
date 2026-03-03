import type { ReactNode } from 'react'

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserStats {
  rating: string
  titlesWatched: number
  comments: number
  likesGiven: number
  likesReceived: number
  hoursWatched: number
  addedToList: number
  daysOnSite: number
}

export interface WatchListItem {
  id: string
  status: string
  title: string
  type: string
  category: string
  genre: string
  score: number | null
  episode: string
  dateAdded: string
  poster: string
  season?: string
  progress?: string
}

export interface WatchHistoryItem {
  id: string
  title: string
  category: string
  series: string
  episode: string
  watchedAt: string
  progress: string
  mediaId?: string
}

export interface ProfileSettings {
  gravatarEmail?: string
  showBookmarksToEveryone?: boolean
  gender?: string
  location?: string
  timezone?: string
  about?: string
  signature?: string
}

export interface PlaybackSettings {
  quality: string
  autoplay: boolean
  skipIntro: boolean
  subtitleLang: string
}

export interface NotificationSettings {
  newReleases: boolean
  recommendations: boolean
  accountActivity: boolean
  promotions: boolean
}

export interface PrivacySettings {
  profileVisibility: string
  trackHistory: boolean
  shareActivity: boolean
  allowDataCollection: boolean
}

export interface AppearanceSettings {
  language: string
  region: string
  subtitleSize: string
}

export interface UserSettings {
  playback?: PlaybackSettings
  notifications?: NotificationSettings
  privacy?: PrivacySettings
  appearance?: AppearanceSettings
}

export interface User {
  id: string | number
  role: string
  username: string
  email: string
  avatar: string
  group: string
  plan?: string
  status: string
  stats: UserStats
  watchList?: WatchListItem[]
  watchHistory?: WatchHistoryItem[]
  profileSettings?: ProfileSettings
  settings?: UserSettings
  watchProgress?: Record<string, number>
}

// ─── Context Types ───────────────────────────────────────────────────────────

export interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData?: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  toggleTheme: () => void
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

export interface ToastContextType {
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface ChildrenProps {
  children: ReactNode
}

// ─── Mock Data Types ─────────────────────────────────────────────────────────

export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

export interface ContentItem {
  id: string
  title: string
  type: string
  genre: string
  year: number
  score: number | null
  status: string
}

export interface ReviewItem {
  id: string
  user: string
  title: string
  rating: number
  text: string
  date: string
}

export interface ReportItem {
  id: string
  reporter: string
  target: string
  targetType: string
  reason: string
  description: string
  date: string
  status: string
}

export interface AdminUser {
  id: number
  username: string
  email: string
  role: string
  status: string
  joined: string
  avatar: string
  titlesWatched: number
  reviewCount: number
  plan: string
}

export interface MediaItem {
  id: string
  title: string
  type: string
  genre: string
  score: number
  year: number
  poster: string
}

export interface TrendingItem extends MediaItem {
  rank: number
  views: string
  trendPct: string
  description: string
  thumb: string
}

export interface CardScheme {
  name: string
  pattern: RegExp
  lengths: number[]
  cvvLengths: number[]
  luhn: boolean
}

export interface PlanData {
  id: string
  name: string
  subtitle: string
  priceLabel: string
  priceValue: string
  cta: string
  price?: number
  features: string[]
}

export interface VideoItem {
  id: string
  title: string
  category: string
  type: string
  genre: string
  series: string
  episode: string
  src: string
  durationSec?: number
}
