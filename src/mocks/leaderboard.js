export const SCORING_WEIGHTS = {
  watchTime: 1,
  moviesCompleted: 5,
  activityScore: 3,
  reviewsWritten: 2,
  likesReceived: 0.5,
};

export const LEADERBOARD_FILTERS = {
  TIME: [
    { id: 'all', label: 'All Time' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'weekly', label: 'Weekly' },
  ],
  SCOPE: [
    { id: 'global', label: 'Global' },
    { id: 'country', label: 'Country' },
    { id: 'friends', label: 'Friends' },
  ],
};

const generateRandomStats = () => {
  const hoursWatched = Math.floor(Math.random() * 500) + 10;
  const moviesWatched = Math.floor(hoursWatched / 2.5);
  const episodesWatched = Math.floor(hoursWatched * 3);
  const reviewsWritten = Math.floor(Math.random() * 50) + 1;
  const avgRating = (Math.random() * 2 + 3).toFixed(1);
  const likesReceived = Math.floor(Math.random() * 500) + 10;
  const activityScore = Math.floor(
    hoursWatched * SCORING_WEIGHTS.watchTime +
    moviesWatched * SCORING_WEIGHTS.moviesCompleted +
    reviewsWritten * SCORING_WEIGHTS.reviewsWritten +
    likesReceived * SCORING_WEIGHTS.likesReceived
  );

  return {
    hoursWatched,
    moviesWatched,
    episodesWatched,
    avgRating: parseFloat(avgRating),
    reviewsWritten,
    likesReceived,
    activityScore,
  };
};

export const MOCK_LEADERBOARD_USERS = [
  {
    id: 'user-1',
    username: 'CinephileKing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cinephile',
    country: 'US',
    previousRank: 2,
    ...generateRandomStats(),
  },
  {
    id: 'user-2',
    username: 'MovieNinja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja',
    country: 'UK',
    previousRank: 1,
    ...generateRandomStats(),
  },
  {
    id: 'user-3',
    username: 'SeriesAddict',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=series',
    country: 'CA',
    previousRank: 4,
    ...generateRandomStats(),
  },
  {
    id: 'user-4',
    username: 'FilmCriticPro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=critic',
    country: 'US',
    previousRank: 3,
    ...generateRandomStats(),
  },
  {
    id: 'user-5',
    username: 'BingeWatcher99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=binge',
    country: 'AU',
    previousRank: 7,
    ...generateRandomStats(),
  },
  {
    id: 'user-6',
    username: 'DramaQueen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drama',
    country: 'DE',
    previousRank: 5,
    ...generateRandomStats(),
  },
  {
    id: 'user-7',
    username: 'HorrorFanatic',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=horror',
    country: 'JP',
    previousRank: 9,
    ...generateRandomStats(),
  },
  {
    id: 'user-8',
    username: 'SciFiEnthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=scifi',
    country: 'FR',
    previousRank: 6,
    ...generateRandomStats(),
  },
  {
    id: 'user-9',
    username: 'IndieLover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=indie',
    country: 'US',
    previousRank: 11,
    ...generateRandomStats(),
  },
  {
    id: 'user-10',
    username: 'ClassicMovieBuff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=classic',
    country: 'IT',
    previousRank: 8,
    ...generateRandomStats(),
  },
  {
    id: 'user-11',
    username: 'ActionJunkie',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=action',
    country: 'BR',
    previousRank: 12,
    ...generateRandomStats(),
  },
  {
    id: 'user-12',
    username: 'DocumentaryFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doc',
    country: 'ES',
    previousRank: 10,
    ...generateRandomStats(),
  },
  {
    id: 'user-13',
    username: 'RomanceReader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=romance',
    country: 'MX',
    previousRank: 14,
    ...generateRandomStats(),
  },
  {
    id: 'user-14',
    username: 'ComedyKing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comedy',
    country: 'IN',
    previousRank: 13,
    ...generateRandomStats(),
  },
  {
    id: 'user-15',
    username: 'ThrillerSeeker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thriller',
    country: 'KR',
    previousRank: 16,
    ...generateRandomStats(),
  },
  {
    id: 'user-16',
    username: 'AnimeWatcher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anime',
    country: 'JP',
    previousRank: 15,
    ...generateRandomStats(),
  },
  {
    id: 'user-17',
    username: 'OscarPredictor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oscar',
    country: 'US',
    previousRank: 18,
    ...generateRandomStats(),
  },
  {
    id: 'user-18',
    username: 'NightOwlViewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nightowl',
    country: 'SE',
    previousRank: 17,
    ...generateRandomStats(),
  },
  {
    id: 'user-19',
    username: 'WeekendBinger',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=weekend',
    country: 'NL',
    previousRank: 20,
    ...generateRandomStats(),
  },
  {
    id: 'user-20',
    username: 'MoviegoerX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moviex',
    country: 'PL',
    previousRank: 19,
    ...generateRandomStats(),
  },
];

export const COUNTRY_FLAGS = {
  US: '🇺🇸',
  UK: '🇬🇧',
  CA: '🇨🇦',
  AU: '🇦🇺',
  DE: '🇩🇪',
  JP: '🇯🇵',
  FR: '🇫🇷',
  BR: '🇧🇷',
  ES: '🇪🇸',
  MX: '🇲🇽',
  IN: '🇮🇳',
  KR: '🇰🇷',
  IT: '🇮🇹',
  SE: '🇸🇪',
  NL: '🇳🇱',
  PL: '🇵🇱',
};
