// ─── User DTOs ───────────────────────────────────────────────────────────────

export const URole = {
  User: 0,
  Admin: 1,
}

export const UserRoleLabel = {
  [URole.User]: 'user',
  [URole.Admin]: 'admin',
}

// ─── Content DTOs ────────────────────────────────────────────────────────────

/**
 * Maps to backend ContentDTO
 * POST /api/content, GET /api/content/{id}, etc.
 */
export function mapContentDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    title: dto.Title ?? dto.title ?? '',
    externalId: dto.ExternalId ?? dto.externalId,
    type: dto.Type ?? dto.type ?? '',
    category: dto.Category ?? dto.category ?? '',
    year: dto.Year ?? dto.year ?? null,
    genres: dto.Genres ?? dto.genres ?? [],
    country: dto.Country ?? dto.country ?? [],
    director: dto.Director ?? dto.director ?? '',
    cast: dto.Cast ?? dto.cast ?? [],
    duration: dto.Duration ?? dto.duration ?? '',
    rating: dto.Rating ?? dto.rating ?? null,
    score: dto.Score ?? dto.score ?? null,
    rank: dto.Rank ?? dto.rank ?? null,
    trendPercentage: dto.TrendPercentage ?? dto.trendPercentage ?? '',
    views: dto.Views ?? dto.views ?? '',
    series: dto.Series ?? dto.series ?? '',
    episode: dto.Episode ?? dto.episode ?? '',
    durationSeconds: dto.DurationSeconds ?? dto.durationSeconds ?? null,
    description: dto.Description ?? dto.description ?? '',
    poster: resolveMediaUrl(dto.Poster ?? dto.poster, 'image'),
    thumbnail: resolveMediaUrl(dto.Thumbnail ?? dto.thumbnail, 'image'),
    backdrop: resolveMediaUrl(dto.Backdrop ?? dto.backdrop, 'image'),
    videoSource: resolveMediaUrl(dto.VideoSource ?? dto.videoSource, 'video'),
    isPrivate: dto.IsPrivate ?? dto.isPrivate ?? false,
  }
}

const DEFAULT_POSTER = '/api/media/image/defaults/default-poster.png'
const DEFAULT_THUMBNAIL = '/api/media/image/defaults/default-thumbnail.png'
const DEFAULT_BACKDROP = '/api/media/image/defaults/default-backdrop.png'

export { DEFAULT_POSTER, DEFAULT_THUMBNAIL, DEFAULT_BACKDROP }

function resolveMediaUrl(value, type) {
  if (!value) {
    if (type === 'video') return ''
    if (type === 'image') return DEFAULT_POSTER
    return ''
  }
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/api/')) return value
  if (type === 'video') return `/api/media/video/${value}`
  return `/api/media/image/${value}`
}

/**
 * Maps to backend FeaturedContentDto (home page featured)
 * Note: backend FeaturedContentDto does NOT have an Id field
 */
export function mapFeaturedContentDTO(dto) {
  if (!dto) return null
  return {
    title: dto.Title ?? dto.title ?? '',
    type: dto.Type ?? dto.type ?? '',
    genre: dto.Genre ?? dto.genre ?? '',
    year: dto.Year ?? dto.year ?? 0,
    score: dto.Score ?? dto.score ?? 0,
    views: dto.Views ?? dto.views ?? '',
    description: dto.Description ?? dto.description ?? '',
    poster: dto.Poster ?? dto.poster ?? '',
  }
}

/**
 * Maps to backend TrendingItemDto
 */
export function mapTrendingItemDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    rank: dto.Rank ?? dto.rank ?? 0,
    title: dto.Title ?? dto.title ?? '',
    type: dto.Type ?? dto.type ?? '',
    genre: dto.Genre ?? dto.genre ?? '',
    year: dto.Year ?? dto.year ?? 0,
    score: dto.Score ?? dto.score ?? 0,
    views: dto.Views ?? dto.views ?? '',
    trendPct: dto.TrendPct ?? dto.trendPct ?? '',
    description: dto.Description ?? dto.description ?? '',
    thumb: resolveMediaUrl(dto.Thumb ?? dto.thumb, 'image'),
  }
}

/**
 * Maps to backend ContentCardDto (home/trending rows)
 */
export function mapContentCardDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    title: dto.Title ?? dto.title ?? '',
    type: dto.Type ?? dto.type ?? '',
    genre: dto.Genre ?? dto.genre ?? '',
    score: dto.Score ?? dto.score ?? 0,
    year: dto.Year ?? dto.year ?? 0,
    poster: resolveMediaUrl(dto.Poster ?? dto.poster, 'image'),
  }
}

// ─── Home Payload ────────────────────────────────────────────────────────────

export function mapHomePayloadFull(payload) {
  if (!payload) return null
  return {
    featured: mapFeaturedContentDTO(payload.Featured ?? payload.featured),
    trendingRow: (payload.TrendingRow ?? payload.trendingRow ?? []).map(mapContentCardDTO),
    newReleases: (payload.NewReleases ?? payload.newReleases ?? []).map(mapContentCardDTO),
    topRated: (payload.TopRated ?? payload.topRated ?? []).map(mapContentCardDTO),
  }
}

// ─── Trending Payload ────────────────────────────────────────────────────────

export function mapTrendingPayloadFull(payload) {
  if (!payload) return null
  return {
    periods: (payload.Periods ?? payload.periods ?? []).map(mapUiOption),
    filters: (payload.Filters ?? payload.filters ?? []).map(mapUiOption),
    data: (payload.Data ?? payload.data ?? []).map(mapTrendingItemDTO),
  }
}

// ─── Explore Payload ─────────────────────────────────────────────────────────

export function mapExplorePayloadFull(payload) {
  if (!payload) return null
  return {
    categories: payload.Categories ?? payload.categories ?? [],
    movieDatabase: (payload.MovieDatabase ?? payload.movieDatabase ?? []).map(mapContentCardDTO),
    carouselRows: payload.CarouselRows ?? payload.carouselRows ?? [],
  }
}

// ─── History DTO ─────────────────────────────────────────────────────────────

export function mapHistoryDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    userId: dto.UserId ?? dto.userId,
    movieId: dto.MovieId ?? dto.movieId,
    externalMovieId: dto.ExternalMovieId ?? dto.externalMovieId,
    title: dto.MovieTitle ?? dto.movieTitle ?? dto.title ?? '',
    category: dto.Category ?? dto.category ?? '',
    series: dto.Series ?? dto.series ?? '',
    episode: dto.Episode ?? dto.episode ?? '',
    watchedAt: dto.WatchedAt ?? dto.watchedAt,
    watchStatus: dto.WatchStatus ?? dto.watchStatus ?? '',
    progressPercentage: dto.ProgressPercentage ?? dto.progressPercentage ?? 0,
    progress: dto.Progress ?? dto.progress ?? '',
    userRating: dto.UserRating ?? dto.userRating ?? null,
    poster: resolveMediaUrl(dto.Poster ?? dto.poster, 'image'),
  }
}

// ─── List DTO ────────────────────────────────────────────────────────────────

export function mapListDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    userId: dto.UserId ?? dto.userId,
    filmId: dto.FilmId ?? dto.filmId,
    externalFilmId: dto.ExternalFilmId ?? dto.externalFilmId,
    title: dto.FilmTitle ?? dto.FilmTitle ?? dto.title ?? '',
    type: dto.Type ?? dto.type ?? '',
    category: dto.Category ?? dto.category ?? '',
    genre: dto.Genre ?? dto.genre ?? '',
    episode: dto.Episode ?? dto.episode ?? '',
    poster: resolveMediaUrl(dto.Poster ?? dto.poster, 'image'),
    addedAt: dto.AddedAt ?? dto.addedAt,
    status: dto.FilmStatus ?? dto.FilmStatus ?? dto.status ?? '',
    rating: dto.FilmRating ?? dto.filmRating ?? 0,
    score: dto.FilmScore ?? dto.filmScore ?? null,
  }
}

// ─── Profile DTOs ────────────────────────────────────────────────────────────

export function mapUserStatsDTO(dto) {
  if (!dto) return {}
  return {
    rating: dto.Rating ?? dto.rating ?? 0,
    titlesWatched: dto.TitlesWatched ?? dto.titlesWatched ?? 0,
    comments: dto.Comments ?? dto.comments ?? 0,
    likesGiven: dto.LikesGiven ?? dto.likesGiven ?? 0,
    likesReceived: dto.LikesReceived ?? dto.likesReceived ?? 0,
    hoursWatched: dto.HoursWatched ?? dto.hoursWatched ?? 0,
    addedToList: dto.AddedToList ?? dto.addedToList ?? 0,
    daysOnSite: dto.DaysOnSite ?? dto.daysOnSite ?? 0,
  }
}

export function mapWatchListItemDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    status: dto.Status ?? dto.status ?? '',
    title: dto.Title ?? dto.title ?? '',
    type: dto.Type ?? dto.type ?? '',
    category: dto.Category ?? dto.category ?? '',
    genre: dto.Genre ?? dto.genre ?? '',
    score: dto.Score ?? dto.score ?? null,
    episode: dto.Episode ?? dto.episode ?? '',
    dateAdded: dto.DateAdded ?? dto.dateAdded,
    poster: resolveMediaUrl(dto.Poster ?? dto.poster, 'image'),
  }
}

export function mapWatchHistoryItemDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    title: dto.Title ?? dto.title ?? '',
    category: dto.Category ?? dto.category ?? '',
    series: dto.Series ?? dto.series ?? '',
    episode: dto.Episode ?? dto.episode ?? '',
    watchedAt: dto.WatchedAt ?? dto.watchedAt,
    progress: dto.Progress ?? dto.progress ?? '',
  }
}

export function mapProfilePayloadFull(payload) {
  if (!payload) return null
  return {
    id: payload.Id ?? payload.id,
    role: payload.Role ?? payload.role ?? '',
    username: payload.Username ?? payload.username ?? '',
    email: payload.Email ?? payload.email ?? '',
    avatar: payload.Avatar ?? payload.avatar ?? '',
    group: payload.Group ?? payload.group ?? '',
    plan: payload.Plan ?? payload.plan ?? '',
    status: payload.Status ?? payload.status ?? '',
    stats: mapUserStatsDTO(payload.Stats ?? payload.stats),
    watchList: (payload.WatchList ?? payload.watchList ?? []).map(mapWatchListItemDTO).filter(Boolean),
    watchHistory: (payload.WatchHistory ?? payload.watchHistory ?? []).map(mapWatchHistoryItemDTO).filter(Boolean),
  }
}

// ─── Admin DTOs ──────────────────────────────────────────────────────────────

export function mapAdminUserDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    username: dto.Username ?? dto.username ?? '',
    email: dto.Email ?? dto.email ?? '',
    role: dto.Role ?? dto.role ?? '',
    status: dto.Status ?? dto.status ?? '',
    joined: dto.Joined ?? dto.joined,
    avatar: dto.Avatar ?? dto.avatar ?? '',
    titlesWatched: dto.TitlesWatched ?? dto.titlesWatched ?? 0,
    reviewCount: dto.ReviewCount ?? dto.reviewCount ?? 0,
    plan: dto.Pan ?? dto.plan ?? '',
  }
}

export function mapAdminContentItemDTO(dto) {
  if (!dto) return null
  const isPrivate = dto.IsPrivate ?? dto.isPrivate
  return {
    id: dto.Id ?? dto.id,
    title: dto.Title ?? dto.title ?? '',
    type: dto.Type ?? dto.type ?? '',
    genre: dto.Genre ?? dto.genre ?? '',
    year: dto.Year ?? dto.year ?? 0,
    score: dto.Score ?? dto.score ?? 0,
    status: isPrivate ? 'Draft' : 'Published',
  }
}

export function mapReviewDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    user: dto.User ?? dto.user ?? '',
    title: dto.Title ?? dto.title ?? '',
    rating: dto.Rating ?? dto.rating ?? 0,
    text: dto.Text ?? dto.text ?? '',
    date: dto.Date ?? dto.date,
  }
}

export function mapReportDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    reporter: dto.Reporter ?? dto.reporter ?? '',
    target: dto.Target ?? dto.target ?? '',
    targetType: dto.TargetType ?? dto.targetType ?? '',
    reason: dto.Reason ?? dto.reason ?? '',
    description: dto.Description ?? dto.description ?? '',
    date: dto.Date ?? dto.date,
    status: dto.Status ?? dto.status ?? '',
  }
}

// ─── Leaderboard DTOs ────────────────────────────────────────────────────────

export function mapLeaderboardEntryFull(entry) {
  if (!entry) return null
  const rank = entry.Rank ?? entry.rank ?? 0
  const rankChange = entry.RankChange ?? entry.rankChange ?? 0
  return {
    rank,
    rankChange,
    previousRank: rank + rankChange,
    userId: entry.UserId ?? entry.userId,
    username: entry.Username ?? entry.username ?? '',
    avatarUrl: entry.AvatarUrl ?? entry.avatarUrl ?? '',
    country: entry.Country ?? entry.country ?? '',
    watchTimeHours: entry.WatchTimeHours ?? entry.watchTimeHours ?? 0,
    moviesWatched: entry.MoviesWatched ?? entry.moviesWatched ?? 0,
    episodesWatched: entry.EpisodesWatched ?? entry.episodesWatched ?? 0,
    averageRating: entry.AverageRating ?? entry.averageRating ?? 0,
    reviewsWritten: entry.ReviewsWritten ?? entry.reviewsWritten ?? 0,
    score: entry.Score ?? entry.score ?? 0,
  }
}

export function mapLeaderboardPayloadFull(payload) {
  if (!payload) return null
  return {
    filters: {
      time: (payload.Filters?.Time ?? payload.filters?.time ?? []).map(mapUiOption),
      scope: (payload.Filters?.Scope ?? payload.filters?.scope ?? []).map(mapUiOption),
    },
    users: (payload.Users ?? payload.users ?? []).map(mapLeaderboardEntryFull).filter(Boolean),
  }
}

// ─── Auth Response ───────────────────────────────────────────────────────────

export function mapAuthResponseDTO(dto) {
  if (!dto) return null
  const userDTO = dto.User ?? dto.user
  return {
    user: userDTO ? mapUserDTO(userDTO) : null,
    token: dto.Token ?? dto.token ?? '',
  }
}

export function mapUserDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    name: dto.Name ?? dto.name ?? '',
    email: dto.Email ?? dto.email ?? '',
    level: dto.Level ?? dto.level ?? URole.User,
    historyId: dto.HistoryId ?? dto.historyId ?? 0,
    movieListId: dto.MovieListId ?? dto.movieListId ?? 0,
  }
}

// ─── UI Option ───────────────────────────────────────────────────────────────

export function mapUiOption(option) {
  if (!option) return null
  return {
    id: option.id ?? option.Id ?? option.value ?? option.Value ?? option.label ?? option.Label ?? '',
    label: option.label ?? option.Label ?? option.value ?? option.Value ?? '',
    value: option.value ?? option.Value ?? option.id ?? option.Id ?? '',
    icon: option.icon ?? option.Icon ?? '',
    path: option.path ?? option.Path ?? '',
    to: option.to ?? option.To ?? option.path ?? option.Path ?? '',
    filter: option.filter ?? option.Filter ?? '',
  }
}

// ─── Subscription DTOs ───────────────────────────────────────────────────────

export function mapSubscriptionDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    userId: dto.UserId ?? dto.userId,
    plan: dto.Plan ?? dto.plan ?? 0,
    price: dto.Price ?? dto.price ?? 0,
    startDate: dto.StartDate ?? dto.startDate,
    endDate: dto.EndDate ?? dto.endDate,
    isActive: dto.IsActive ?? dto.isActive ?? false,
    daysRemaining: dto.DaysRemaining ?? dto.daysRemaining ?? 0,
  }
}

// ─── Movie DTOs ──────────────────────────────────────────────────────────────

export function mapMovieDataDTO(dto) {
  if (!dto) return null
  return {
    id: dto.Id ?? dto.id,
    title: dto.Title ?? dto.title ?? '',
    externalId: dto.ExternalId ?? dto.externalId,
    type: dto.Type ?? dto.type ?? '',
    category: dto.Category ?? dto.category ?? '',
    year: dto.Year ?? dto.year ?? null,
    country: dto.Country ?? dto.country ?? '',
    director: dto.Director ?? dto.director ?? '',
    cast: dto.Cast ?? dto.cast ?? '',
    duration: dto.Duration ?? dto.duration ?? '',
    rating: dto.Rating ?? dto.rating ?? null,
    score: dto.Score ?? dto.score ?? null,
    rank: dto.Rank ?? dto.rank ?? null,
    trendPercentage: dto.TrendPercentage ?? dto.trendPercentage ?? '',
    views: dto.Views ?? dto.views ?? '',
    series: dto.Series ?? dto.series ?? '',
    episode: dto.Episode ?? dto.episode ?? '',
    durationSeconds: dto.DurationSeconds ?? dto.durationSeconds ?? null,
    description: dto.Description ?? dto.description ?? '',
    poster: resolveMediaUrl(dto.Poster ?? dto.poster, 'image'),
    thumbnail: resolveMediaUrl(dto.Thumbnail ?? dto.thumbnail, 'image'),
    backdrop: resolveMediaUrl(dto.Backdrop ?? dto.backdrop, 'image'),
    videoSource: resolveMediaUrl(dto.VideoSource ?? dto.videoSource, 'video'),
    isPrivate: dto.IsPrivate ?? dto.isPrivate ?? false,
  }
}

export function mapMovieUploadResponseDTO(dto) {
  if (!dto) return null
  return {
    movieId: dto.MovieId ?? dto.movieId,
    title: dto.Title ?? dto.title ?? '',
    videoFileName: dto.VideoFileName ?? dto.videoFileName ?? '',
    message: dto.Message ?? dto.message ?? '',
    success: dto.Success ?? dto.success ?? false,
  }
}
