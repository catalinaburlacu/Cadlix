import React, { useState, useMemo, memo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import Button from "../../../components/common/Button.jsx";
import Input from "../../../components/common/Input.jsx";
import { SkeletonAvatar, SkeletonStats } from "../../../components/common/Skeleton.jsx";
import { CONTENT_GENRES, CONTENT_TYPES, SORT_OPTIONS } from "../../../utils/constants.js";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import PropTypes from 'prop-types';
import "./Profile.css";

const TABS = [
  { id: "watching", label: "Watching" },
  { id: "planned", label: "Planned" },
  { id: "completed", label: "Completed" },
  { id: "dropped", label: "Dropped" },
  { id: "favorites", label: "Favorites" }
];

const StatCard = memo(function StatCard({ value, label, icon, highlight }) {
  return (
    <div className={`stat-card ${highlight ? 'highlight' : ''}`}>
      <i className={`bx ${icon} stat-icon`} aria-hidden='true'></i>
      <div className='stat-content'>
        <span className='stat-value'>{value}</span>
        <span className='stat-label'>{label}</span>
      </div>
    </div>
  )
})

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  highlight: PropTypes.bool,
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useUser()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('watching')
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [avatarFileName, setAvatarFileName] = useState('No file chosen')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [gravatarEmail, setGravatarEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showBookmarks, setShowBookmarks] = useState('yes')
  const [gender, setGender] = useState('female')
  const [location, setLocation] = useState('')
  const [timezone, setTimezone] = useState('default-gmt-plus-3')
  const [about, setAbout] = useState('')
  const [signature, setSignature] = useState('')
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedSort, setSelectedSort] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const profileSettings = user?.profileSettings || {};
  const profileAbout = profileSettings.about || "";
  const visibleAvatar = avatarUrl || user?.avatar || "https://via.placeholder.com/120?text=Avatar";

  const statsData = useMemo(() => {
    if (!user) return []
    return [
      { value: user.stats?.rating || '0', label: 'Rating', icon: 'bx-star', highlight: true },
      { value: user.stats?.titlesWatched || 0, label: 'Titles Watched', icon: 'bx-tv' },
      { value: user.stats?.comments || 0, label: 'Comments', icon: 'bx-comment' },
      { value: user.stats?.likesGiven || 0, label: 'Likes Given', icon: 'bx-heart' },
      { value: user.stats?.likesReceived || 0, label: 'Likes Received', icon: 'bx-like' },
      { value: user.stats?.hoursWatched || 0, label: 'Hours Watched', icon: 'bx-time' },
      { value: user.stats?.addedToList || 0, label: 'In List', icon: 'bx-list-plus' },
      { value: user.stats?.daysOnSite || 0, label: 'Days Active', icon: 'bx-calendar' },
    ]
  }, [user])

  const handleTabChange = React.useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleLogout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
      setIsLoading(false);
    }
  }, [logout, navigate, toast]);

  const handleDeleteProfile = React.useCallback(async () => {
    if (isDeleteLoading) return;

    const firstConfirm = window.confirm(
      "Esti sigur ca vrei sa iti stergi profilul? Aceasta actiune este permanenta."
    );
    if (!firstConfirm) return;

    const typedConfirmation = window.prompt(
      "Confirmare 2/2: scrie exact STERGE pentru a continua."
    );
    if ((typedConfirmation || "").trim().toUpperCase() !== "STERGE") {
      toast.error("Stergerea a fost anulata. Confirmarea nu a fost corecta.");
      return;
    }

    setIsDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 350));
      logout();
      toast.success("Profilul a fost sters definitiv.");
      navigate("/login");
    } catch {
      toast.error("Stergerea profilului a esuat.");
      setIsDeleteLoading(false);
    }
  }, [isDeleteLoading, logout, navigate, toast]);

  const handleToggleEditor = React.useCallback(() => {
    if (!isEditOpen) {
      setProfileName(user?.username || '')
      setProfileEmail(user?.email || '')
      setAvatarUrl(user?.avatar || '')
      setGravatarEmail(user?.email || '')
      setShowBookmarks(user?.profileSettings?.showBookmarksToEveryone === false ? 'no' : 'yes')
      setGender(user?.profileSettings?.gender || 'female')
      setLocation(user?.profileSettings?.location || '')
      setTimezone(user?.profileSettings?.timezone || 'default-gmt-plus-3')
      setAbout(user?.profileSettings?.about || '')
      setSignature(user?.profileSettings?.signature || '')
      setAvatarFileName('No file chosen')
    }
    setIsEditOpen(prev => !prev)
  }, [isEditOpen, user])

  const handleAvatarChange = React.useCallback(
    e => {
      const file = e.target.files?.[0]
      if (!file) {
        setAvatarFileName('No file chosen')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.')
        return
      }

      setAvatarFileName(file.name)
      setIsAvatarProcessing(true)

      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          setIsAvatarProcessing(false)
          toast.error('Failed to process image.')
          return
        }

        const img = new Image()
        img.onload = () => {
          const size = 256
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            setIsAvatarProcessing(false)
            toast.error('Failed to process image.')
            return
          }

          const srcSize = Math.min(img.width, img.height)
          const sx = (img.width - srcSize) / 2
          const sy = (img.height - srcSize) / 2
          ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, size, size)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          setAvatarUrl(compressedDataUrl)
          setIsAvatarProcessing(false)
        }
        img.onerror = () => {
          setIsAvatarProcessing(false)
          toast.error('Invalid image file.')
        }
        img.src = reader.result
      }
      reader.onerror = () => {
        setIsAvatarProcessing(false)
        toast.error('Failed to read image.')
      }
      reader.readAsDataURL(file)
    },
    [toast]
  )

  const handleDeleteAvatar = React.useCallback(() => {
    setAvatarUrl('')
    setAvatarFileName('No file chosen')
  }, [])

  const handleProfileSave = React.useCallback(
    e => {
      e.preventDefault()
      if (newPassword && newPassword !== repeatPassword) {
        toast.error('New password and repeat password do not match.')
        return
      }
      if (isAvatarProcessing) {
        toast.error('Please wait until avatar processing finishes.')
        return
      }

      updateUser({
        username: profileName.trim() || user?.username || '',
        email: profileEmail.trim() || user?.email || '',
        avatar: avatarUrl,
        profileSettings: {
          ...(user?.profileSettings || {}),
          gravatarEmail: gravatarEmail.trim(),
          showBookmarksToEveryone: showBookmarks === 'yes',
          gender,
          location: location.trim(),
          timezone,
          about: about.trim(),
          signature: signature.trim(),
        },
      })

      setOldPassword('')
      setNewPassword('')
      setRepeatPassword('')
      setIsEditOpen(false)
      toast.success('Profile updated.')
    },
    [
      about,
      avatarUrl,
      gender,
      gravatarEmail,
      location,
      newPassword,
      profileEmail,
      profileName,
      repeatPassword,
      showBookmarks,
      signature,
      timezone,
      toast,
      updateUser,
      user,
      isAvatarProcessing,
    ]
  );

  const watchList = useMemo(() => user?.watchList || [], [user]);

  const filteredEntries = useMemo(() => {
    let list = [...watchList];

    list = list.filter((item) => item.status === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }

    if (selectedType) {
      if (selectedType === "anime") {
        list = list.filter((item) => item.category.toLowerCase() === "anime");
      } else {
        list = list.filter((item) => item.type === selectedType);
      }
    }

    if (selectedGenre) {
      list = list.filter((item) => item.genre === selectedGenre);
    }

    if (selectedSort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "score") {
      list.sort((a, b) => b.score - a.score);
    } else if (selectedSort === "date") {
      list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (selectedSort === "duration") {
      list.sort((a, b) => (a.episode || "").localeCompare(b.episode || ""));
    }

    return list;
  }, [activeTab, searchQuery, selectedType, selectedGenre, selectedSort, watchList]);

  const profileSubnav = (
    <nav className="page-subnav" aria-label="Account navigation">
      <NavLink to="/profile" end className={({ isActive }) => `page-subnav-link${isActive ? ' active' : ''}`}>
        Profile
      </NavLink>
      <NavLink to="/subscriptions" className={({ isActive }) => `page-subnav-link${isActive ? ' active' : ''}`}>
        Subscriptions
      </NavLink>
    </nav>
  );

  if (!user) {
    return (
      <SidebarLayout navbarContent={profileSubnav}>
        <div className='profile-page'>
          <div className='profile-container'>
            <div className='profile-header skeleton-profile-header'>
              <div className='profile-header-left'>
                <SkeletonAvatar size='large' />
                <div className='profile-header-info'>
                  <div className='skeleton-text skeleton-text--title' />
                  <div className='skeleton-text skeleton-text--subtitle' />
                </div>
              </div>
            </div>
            <SkeletonStats count={8} />
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout navbarContent={profileSubnav}>
      <div className="profile-page">
        <div className="profile-container">



          <nav className="profile-nav" aria-label="Profile navigation">
            <button className="back-btn" onClick={() => navigate('/home')}>
              <i className="bx bx-arrow-back" aria-hidden="true"></i>
              Back to Home
            </button>

            <div className="profile-nav-actions">
              <Button
                variant="secondary"
                size="small"
                onClick={() => toast.info('Settings coming soon!')}
              >
                <i className="bx bx-cog" aria-hidden="true"></i>
                Settings
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={handleLogout}
                isLoading={isLoading}
                disabled={isDeleteLoading}
              >
                <i className="bx bx-log-out" aria-hidden="true"></i>
                Logout
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDeleteProfile}
                isLoading={isDeleteLoading}
                disabled={isLoading}
              >
                <i className="bx bx-trash" aria-hidden="true"></i>
                Delete Profile
              </Button>
            </div>
          </nav>



          <header className="profile-header">
            <div className="profile-header-left">
              <div className="avatar-container">
                <img
                  className="avatar"
                  src={visibleAvatar}
                  alt={`${user.username}'s avatar`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120?text=Avatar';
                  }}
                />
                <span
                  className={`status-badge status-${user.status?.toLowerCase() || 'online'}`}
                  aria-label={`Status: ${user.status || 'Online'}`}
                />
              </div>

              <div className='profile-header-info'>
                <div className='username-row'>
                  <h1 className='username'>{user.username}</h1>
                  <button
                    className='plan-badge'
                    onClick={() => navigate('/subscriptions')}
                    title='Click to upgrade or manage your plan'
                  >
                    {user.plan || 'Basic'}
                  </button>
                </div>
                <p className='user-email'>{user.email}</p>
                {profileAbout ? (
                  <p className='user-extra'>
                    <strong>About:</strong> {profileAbout}
                  </p>
                ) : null}
              </div>
            </div>

            <div className='profile-header-right'>
              <Button variant='primary' size='small' onClick={handleToggleEditor}>
                <i className='bx bx-edit' aria-hidden='true'></i>
                {isEditOpen ? 'Close Editor' : 'Edit Profile'}
              </Button>
            </div>
          </header>

          {isEditOpen && (
            <section className='profile-edit-panel' aria-labelledby='edit-profile-heading'>
              <h2 id='edit-profile-heading' className='edit-title'>
                Profile Editing
              </h2>
              <form className='edit-form' onSubmit={handleProfileSave}>
                <div className='edit-grid'>
                  <div className='edit-field'>
                    <label htmlFor='profile-name'>Your Name:</label>
                    <input
                      id='profile-name'
                      type='text'
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      placeholder='Your Name'
                    />
                  </div>

                  <div className='edit-field'>
                    <label htmlFor='profile-email'>Your E-Mail:</label>
                    <input
                      id='profile-email'
                      type='email'
                      value={profileEmail}
                      onChange={e => setProfileEmail(e.target.value)}
                      placeholder='your@email.com'
                    />
                  </div>

                  <div className='edit-field edit-field-full'>
                    <label htmlFor='avatar-file'>Avatar:</label>
                    <img
                      className='edit-avatar-preview'
                      src={visibleAvatar}
                      alt='Avatar preview'
                      loading='lazy'
                    />
                    <input
                      id='avatar-file'
                      type='file'
                      accept='image/png,image/jpeg,image/webp'
                      onChange={handleAvatarChange}
                    />
                    <span className='edit-hint'>{avatarFileName}</span>
                    {isAvatarProcessing ? (
                      <span className='edit-hint'>Processing image...</span>
                    ) : null}
                  </div>

                  <div className='edit-field'>
                    <label htmlFor='gravatar-email'>Gravatar Service:</label>
                    <input
                      id='gravatar-email'
                      type='email'
                      value={gravatarEmail}
                      onChange={e => setGravatarEmail(e.target.value)}
                      placeholder='Specify your email in this service'
                    />
                  </div>

                  <div className='edit-field'>
                    <label>&nbsp;</label>
                    <Button type='button' variant='ghost' size='small' onClick={handleDeleteAvatar}>
                      Delete Avatar
                    </Button>
                  </div>
                </div>

                <h3 className='edit-section-title'>Security</h3>
                <div className='edit-grid'>
                  <div className='edit-field'>
                    <label htmlFor='old-password'>Old Password:</label>
                    <input
                      id='old-password'
                      type='password'
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      placeholder='Old Password'
                    />
                  </div>
                  <div className='edit-field'>
                    <label htmlFor='new-password'>New Password:</label>
                    <input
                      id='new-password'
                      type='password'
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder='New Password'
                    />
                  </div>
                  <div className='edit-field'>
                    <label htmlFor='repeat-password'>Repeat Password:</label>
                    <input
                      id='repeat-password'
                      type='password'
                      value={repeatPassword}
                      onChange={e => setRepeatPassword(e.target.value)}
                      placeholder='Repeat New Password'
                    />
                  </div>
                </div>

                <h3 className='edit-section-title'>Information About You</h3>
                <div className='edit-grid'>
                  <div className='edit-field'>
                    <label htmlFor='show-bookmarks'>Show bookmarks to everyone:</label>
                    <select
                      id='show-bookmarks'
                      value={showBookmarks}
                      onChange={e => setShowBookmarks(e.target.value)}
                    >
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </select>
                  </div>

                  <div className='edit-field'>
                    <label htmlFor='gender'>Your gender:</label>
                    <select id='gender' value={gender} onChange={e => setGender(e.target.value)}>
                      <option value='female'>Female</option>
                      <option value='male'>Male</option>
                      <option value='other'>Other</option>
                      <option value='prefer-not'>Prefer not to say</option>
                    </select>
                  </div>

                  <div className='edit-field'>
                    <label htmlFor='location'>Place of residence:</label>
                    <input
                      id='location'
                      type='text'
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder='Place of residence'
                    />
                  </div>

                  <div className='edit-field'>
                    <label htmlFor='timezone'>Timezone:</label>
                    <select
                      id='timezone'
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                    >
                      <option value='default-gmt-plus-3'>
                        Default system settings (GMT+03:00) Russia, Moscow
                      </option>
                      <option value='gmt-5'>GMT-05:00 Eastern Time</option>
                      <option value='gmt'>GMT+00:00 UTC</option>
                      <option value='gmt+1'>GMT+01:00 Central European Time</option>
                      <option value='gmt+9'>GMT+09:00 Japan Standard Time</option>
                    </select>
                  </div>

                  <div className='edit-field edit-field-full'>
                    <label htmlFor='about'>About me:</label>
                    <textarea
                      id='about'
                      value={about}
                      onChange={e => setAbout(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className='edit-field edit-field-full'>
                    <label htmlFor='signature'>Signature:</label>
                    <textarea
                      id='signature'
                      value={signature}
                      onChange={e => setSignature(e.target.value)}
                      rows={3}
                      disabled
                    />
                    <span className='edit-hint'>
                      Do not fill in this field, because your group is not allowed to use signatures
                      in comments.
                    </span>
                  </div>
                </div>

                <div className='edit-actions'>
                  <Button type='submit' variant='primary' size='small'>
                    Submit
                  </Button>
                </div>
              </form>
            </section>
          )}



          <section className="stats-section" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">User Statistics</h2>
            <div className="stats-grid">
              {statsData.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  highlight={stat.highlight}
                />
              ))}
            </div>
          </section>



          <nav className="tabs-container" aria-label="Content tabs">
            <div className="tabs" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  className={`tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>



          <div className="filters-bar">
            <div className="search-container">
              <i className="bx bx-search search-icon" aria-hidden="true"></i>
              <Input
                type="search"
                placeholder="Search your list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search anime list"
              />
            </div>

            <div className="filter-selects">
              <select
                className="filter-select"
                aria-label="Filter by type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value || 'all-types'} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                aria-label="Filter by genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {CONTENT_GENRES.map((genre) => (
                  <option key={genre.value || 'all-genres'} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                aria-label="Sort by"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value || 'sort-by'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="view-toggle" role="group" aria-label="View mode">
                <button
                  className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  title="Grid view"
                >
                  <i className="bx bx-grid-alt" aria-hidden="true"></i>
                </button>
                <button
                  className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  title="List view"
                >
                  <i className="bx bx-list-ul" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>



          <div
            className="content-panel"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            <div className={viewMode === 'grid' ? 'media-grid' : 'media-list'}>
              {filteredEntries.length === 0 ? (
                <div className="empty-state">
                  <i className="bx bx-inbox empty-icon" aria-hidden="true"></i>
                  <p className="empty-message">
                    No entries found in {TABS.find(t => t.id === activeTab)?.label.toLowerCase()}
                  </p>
                  <Button variant='secondary' size='small'>
                    <i className='bx bx-plus' aria-hidden='true'></i>
                    Add Title
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="media-card">
                    <div className="media-card-poster-wrap">
                      {entry.poster ? (
                        <img
                          className="media-card-poster"
                          src={entry.poster}
                          alt={entry.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="media-card-poster media-card-poster--placeholder">
                          <i className="bx bx-film" aria-hidden="true"></i>
                        </div>
                      )}
                      {entry.score != null && (
                        <span className="media-card-score">
                          <i className="bx bxs-star" aria-hidden="true"></i>
                          {entry.score}
                        </span>
                      )}
                    </div>
                    <div className="media-card-body">
                      <span className="media-card-title">{entry.title}</span>
                      <div className="media-card-meta">
                        {entry.type && (
                          <span className="media-card-badge">{entry.type}</span>
                        )}
                        {entry.episode && entry.episode !== '-' && (
                          <span className="media-card-episode">{entry.episode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="media-row">
                    {entry.poster ? (
                      <img
                        className="media-row-poster"
                        src={entry.poster}
                        alt={entry.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="media-row-poster media-row-poster--placeholder">
                        <i className="bx bx-film" aria-hidden="true"></i>
                      </div>
                    )}
                    <div className="media-row-info">
                      <span className="media-row-title">{entry.title}</span>
                      <div className="media-row-meta">
                        {entry.type && (
                          <span className="media-card-badge">{entry.type}</span>
                        )}
                        {entry.genre && (
                          <span className="media-row-genre">{entry.genre}</span>
                        )}
                        {entry.episode && entry.episode !== '-' && (
                          <span className="media-card-episode">{entry.episode}</span>
                        )}
                      </div>
                    </div>
                    {entry.score != null && (
                      <span className="media-row-score">
                        <i className="bx bxs-star" aria-hidden="true"></i>
                        {entry.score}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
