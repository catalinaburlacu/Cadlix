export const ALL_USERS = [
  { id: 1, username: 'john_doe',   email: 'john@example.com',   role: 'user',  status: 'Active',   joined: '2026-02-21', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe',   titlesWatched: 42,  reviewCount: 3, plan: 'Pro' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com',   role: 'user',  status: 'Active',   joined: '2026-02-19', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith', titlesWatched: 18,  reviewCount: 2, plan: 'Free' },
  { id: 3, username: 'carlos_m',   email: 'carlos@example.com', role: 'user',  status: 'Inactive', joined: '2026-02-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos_m',   titlesWatched: 67,  reviewCount: 1, plan: 'Free' },
  { id: 4, username: 'anya_k',     email: 'anya@example.com',   role: 'user',  status: 'Active',   joined: '2026-02-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anya_k',     titlesWatched: 24,  reviewCount: 2, plan: 'Pro' },
  { id: 5, username: 'dev_user',   email: 'dev@cadlix.com',     role: 'admin', status: 'Active',   joined: '2025-01-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev_user',   titlesWatched: 250, reviewCount: 0, plan: 'Admin' },
];

export const INITIAL_CONTENT = [
  { id: 'c-1',  title: 'The Last of Us',         type: 'tv',           genre: 'Drama',      year: 2023, score: 9.2, status: 'Published' },
  { id: 'c-2',  title: 'Oppenheimer',             type: 'movie',        genre: 'Drama',      year: 2023, score: 8.9, status: 'Published' },
  { id: 'c-3',  title: 'Severance',               type: 'tv',           genre: 'Thriller',   year: 2022, score: 8.7, status: 'Published' },
  { id: 'c-4',  title: 'Dune: Part Two',          type: 'movie',        genre: 'Sci-Fi',     year: 2024, score: 8.5, status: 'Published' },
  { id: 'c-5',  title: 'Planet Earth III',        type: 'documentary',  genre: 'Nature',     year: 2023, score: 9.0, status: 'Published' },
  { id: 'c-6',  title: 'The Bear',                type: 'tv',           genre: 'Drama',      year: 2022, score: 8.6, status: 'Published' },
  { id: 'c-7',  title: 'Poor Things',             type: 'movie',        genre: 'Fantasy',    year: 2023, score: 8.0, status: 'Draft' },
  { id: 'c-8',  title: 'Shogun',                  type: 'miniseries',   genre: 'Historical', year: 2024, score: 8.7, status: 'Published' },
];

export const INITIAL_REVIEWS = [
  { id: 'r-1', user: 'john_doe',   title: 'The Last of Us',  rating: 10, text: 'Absolutely masterful storytelling, the best show of the decade.', date: '2026-02-20' },
  { id: 'r-2', user: 'jane_smith', title: 'Oppenheimer',     rating: 9,  text: 'A breathtaking cinematic experience. Nolan at his best.', date: '2026-02-18' },
  { id: 'r-3', user: 'carlos_m',   title: 'Severance',       rating: 8,  text: 'Creepy and brilliant. The world-building is incredible.', date: '2026-02-15' },
  { id: 'r-4', user: 'anya_k',     title: 'The Bear',        rating: 9,  text: 'Stressful but so good. Felt every second of it.', date: '2026-02-12' },
  { id: 'r-5', user: 'john_doe',   title: 'Dune: Part Two',  rating: 8,  text: 'Visually stunning epic. Timothée Chalamet carries it.', date: '2026-02-10' },
  { id: 'r-6', user: 'jane_smith', title: 'Poor Things',     rating: 7,  text: 'Weird and wonderful in equal measure.', date: '2026-02-08' },
];

export const INITIAL_REPORTS = [
  { id: 'rep-1', reporter: 'john_doe',   target: 'carlos_m',                 targetType: 'user',    reason: 'Spam',          description: 'This user keeps posting spam links in comments.', date: '2026-02-21', status: 'Pending' },
  { id: 'rep-2', reporter: 'anya_k',     target: 'Poor Things — jane_smith', targetType: 'review',  reason: 'Inappropriate', description: 'The review contains offensive language and slurs.', date: '2026-02-19', status: 'Pending' },
  { id: 'rep-3', reporter: 'carlos_m',   target: 'john_doe',                 targetType: 'user',    reason: 'Harassment',    description: 'Sending threatening private messages repeatedly.', date: '2026-02-18', status: 'Resolved' },
  { id: 'rep-4', reporter: 'jane_smith', target: 'Shogun',                   targetType: 'content', reason: 'Wrong info',    description: 'The genre classification is incorrect, should be Drama not Historical.', date: '2026-02-17', status: 'Pending' },
  { id: 'rep-5', reporter: 'dev_user',   target: 'anya_k',                   targetType: 'user',    reason: 'Bot account',   description: 'Suspicious bot-like activity from this account.', date: '2026-02-16', status: 'Dismissed' },
  { id: 'rep-6', reporter: 'john_doe',   target: 'Planet Earth III',         targetType: 'content', reason: 'Duplicate',     description: 'This title already exists under a different name.', date: '2026-02-14', status: 'Pending' },
];

export const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: 'bx-grid-alt' },
  { id: 'users',    label: 'Users',    icon: 'bx-group' },
  { id: 'content',  label: 'Content',  icon: 'bx-film' },
  { id: 'reviews',  label: 'Reviews',  icon: 'bx-comment-detail' },
  { id: 'reports',  label: 'Reports',  icon: 'bx-flag' },
];

export const EMPTY_FORM = { title: '', type: 'movie', genre: [], year: String(new Date().getFullYear()), score: '' };
