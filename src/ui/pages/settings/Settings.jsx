import { useState } from 'react'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import Button from '../../../components/common/Button.jsx'
import Input from '../../../components/common/Input.jsx'
import { useUser } from '../../../context/useUser.js'
import { useToast } from '../../../hooks/useToast.js'
import './Settings.css'

const SECTIONS = [
  { id: 'playback',       label: 'Playback',       icon: 'bx-play-circle' },
  { id: 'notifications',  label: 'Notifications',  icon: 'bx-bell' },
  { id: 'privacy',        label: 'Privacy',        icon: 'bx-lock' },
  { id: 'appearance',     label: 'Appearance',     icon: 'bx-palette' },
  { id: 'security',       label: 'Security',       icon: 'bx-shield' },
]

const DEFAULT_SETTINGS = {
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

function SettingsRow({ label, description, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <span className="settings-row-label">{label}</span>
        {description && (
          <span className="settings-row-desc">{description}</span>
        )}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, id }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
    </label>
  )
}

export default function Settings() {
  const { user, updateUser } = useUser()
  const toast = useToast()
  const [activeSection, setActiveSection] = useState('playback')
  const [isSaving, setIsSaving] = useState(false)

  const saved = user?.settings || {}
  const [settings, setSettings] = useState({
    playback:      { ...DEFAULT_SETTINGS.playback,      ...saved.playback },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...saved.notifications },
    privacy:       { ...DEFAULT_SETTINGS.privacy,       ...saved.privacy },
    appearance:    { ...DEFAULT_SETTINGS.appearance,    ...saved.appearance },
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function set(section, key, value) {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  async function handleSave() {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 500))
    updateUser({ settings })
    toast.success('Settings saved')
    setIsSaving(false)
  }

  function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    toast.success('Password updated successfully')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  // ---- Section renderers ----

  function renderPlayback() {
    const s = settings.playback
    return (
      <>
        <SettingsRow
          label="Video Quality"
          description="Default streaming quality for all content"
        >
          <select
            className="settings-select"
            value={s.quality}
            onChange={e => set('playback', 'quality', e.target.value)}
          >
            <option value="auto">Auto (Recommended)</option>
            <option value="720p">720p HD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="4k">4K Ultra HD</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Autoplay Next Episode"
          description="Automatically start the next episode in a series"
        >
          <Toggle
            id="autoplay"
            checked={s.autoplay}
            onChange={v => set('playback', 'autoplay', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Skip Intro"
          description="Automatically skip title sequences and credit intros"
        >
          <Toggle
            id="skipIntro"
            checked={s.skipIntro}
            onChange={v => set('playback', 'skipIntro', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Subtitle Language"
          description="Default subtitle language during playback"
        >
          <select
            className="settings-select"
            value={s.subtitleLang}
            onChange={e => set('playback', 'subtitleLang', e.target.value)}
          >
            <option value="off">Off</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </SettingsRow>
      </>
    )
  }

  function renderNotifications() {
    const s = settings.notifications
    return (
      <>
        <SettingsRow
          label="New Releases"
          description="Get notified when titles on your watchlist release new episodes"
        >
          <Toggle
            id="notif-releases"
            checked={s.newReleases}
            onChange={v => set('notifications', 'newReleases', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Weekly Recommendations"
          description="Personalized picks based on your viewing history"
        >
          <Toggle
            id="notif-recommendations"
            checked={s.recommendations}
            onChange={v => set('notifications', 'recommendations', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Account Activity"
          description="Alerts for logins, password changes, and account updates"
        >
          <Toggle
            id="notif-account"
            checked={s.accountActivity}
            onChange={v => set('notifications', 'accountActivity', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Promotional Emails"
          description="Special offers, new features, and news from Cadlix"
        >
          <Toggle
            id="notif-promo"
            checked={s.promotions}
            onChange={v => set('notifications', 'promotions', v)}
          />
        </SettingsRow>
      </>
    )
  }

  function renderPrivacy() {
    const s = settings.privacy
    return (
      <>
        <SettingsRow
          label="Profile Visibility"
          description="Control who can see your profile and watch activity"
        >
          <select
            className="settings-select"
            value={s.profileVisibility}
            onChange={e => set('privacy', 'profileVisibility', e.target.value)}
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Track Watch History"
          description="Save what you watch to improve recommendations"
        >
          <Toggle
            id="priv-history"
            checked={s.trackHistory}
            onChange={v => set('privacy', 'trackHistory', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Share Activity"
          description="Let friends see what you are currently watching"
        >
          <Toggle
            id="priv-share"
            checked={s.shareActivity}
            onChange={v => set('privacy', 'shareActivity', v)}
          />
        </SettingsRow>

        <SettingsRow
          label="Allow Data Collection"
          description="Help improve Cadlix by sharing anonymised usage data"
        >
          <Toggle
            id="priv-data"
            checked={s.allowDataCollection}
            onChange={v => set('privacy', 'allowDataCollection', v)}
          />
        </SettingsRow>
      </>
    )
  }

  function renderAppearance() {
    const s = settings.appearance
    return (
      <>
        <SettingsRow
          label="Interface Language"
          description="Language used throughout the platform"
        >
          <select
            className="settings-select"
            value={s.language}
            onChange={e => set('appearance', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Region"
          description="Affects available content and local pricing"
        >
          <select
            className="settings-select"
            value={s.region}
            onChange={e => set('appearance', 'region', e.target.value)}
          >
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="eu">European Union</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="other">Other</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Subtitle Size"
          description="Size of subtitles displayed during video playback"
        >
          <select
            className="settings-select"
            value={s.subtitleSize}
            onChange={e => set('appearance', 'subtitleSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </SettingsRow>
      </>
    )
  }

  function renderSecurity() {
    return (
      <>
        <div className="settings-subsection">
          <h3 className="settings-subsection-title">Change Password</h3>
          <div className="settings-password-form">
            <div className="settings-field">
              <label className="settings-label">Current Password</label>
              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">New Password</label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button variant="secondary" onClick={handlePasswordChange}>
              Update Password
            </Button>
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-subsection">
          <h3 className="settings-subsection-title">Active Sessions</h3>
          <p className="settings-subsection-desc">
            Sign out of all other devices and browsers. This session will remain active.
          </p>
          <Button variant="ghost" onClick={() => toast.info('All other sessions have been signed out')}>
            <i className="bx bx-log-out" aria-hidden="true"></i>
            Sign Out All Other Devices
          </Button>
        </div>
      </>
    )
  }

  const sectionRenderers = {
    playback:      renderPlayback,
    notifications: renderNotifications,
    privacy:       renderPrivacy,
    appearance:    renderAppearance,
    security:      renderSecurity,
  }

  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label

  return (
    <SidebarLayout>
      <div className="settings-page">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your playback, privacy, and account preferences</p>
        </div>

        <div className="settings-layout">
          {/* Left nav */}
          <nav className="settings-nav" aria-label="Settings sections">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                className={`settings-nav-item${activeSection === section.id ? ' active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                <i className={`bx ${section.icon}`} aria-hidden="true"></i>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>

          {/* Right panel */}
          <div className="settings-panel">
            <div className="settings-panel-header">
              <h2 className="settings-panel-title">{activeLabel}</h2>
              {activeSection !== 'security' && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>

            <div className="settings-rows">
              {sectionRenderers[activeSection]?.()}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
