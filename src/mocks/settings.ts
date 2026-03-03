import type { PlaybackSettings, NotificationSettings, PrivacySettings, AppearanceSettings } from '@/types'

export const SECTIONS: { id: string; label: string; icon: string }[] = [
  { id: 'playback', label: 'Playback', icon: 'bx-play-circle' },
  { id: 'notifications', label: 'Notifications', icon: 'bx-bell' },
  { id: 'privacy', label: 'Privacy', icon: 'bx-lock' },
  { id: 'appearance', label: 'Appearance', icon: 'bx-palette' },
  { id: 'security', label: 'Security', icon: 'bx-shield' },
]

export const DEFAULT_SETTINGS: {
  playback: PlaybackSettings
  notifications: NotificationSettings
  privacy: PrivacySettings
  appearance: AppearanceSettings
} = {
  playback: {
    quality: 'auto',
    autoplay: true,
    skipIntro: false,
    subtitleLang: 'off',
  },
  notifications: {
    newReleases: true,
    recommendations: true,
    accountActivity: true,
    promotions: false,
  },
  privacy: {
    profileVisibility: 'public',
    trackHistory: true,
    shareActivity: false,
    allowDataCollection: true,
  },
  appearance: {
    language: 'en',
    region: 'us',
    subtitleSize: 'medium',
  },
}
