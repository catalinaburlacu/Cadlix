import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button.jsx";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import { useUser } from "../../../context/useUser.js";
import "./Home.css";

// ─── Category nav ────────────────────────────────────────────────────────────

const CATEGORY_NAV_ITEMS = [
  { id: "home",          label: "Home",          to: "/home",                        filter: null },
  { id: "trending",      label: "Trending",       to: "/trending",                    filter: "all" },
  { id: "movies",        label: "Movies",         to: "/trending?filter=movie",       filter: "movie" },
  { id: "series",        label: "Series",         to: "/trending?filter=tv",          filter: "tv" },
  { id: "documentaries", label: "Documentaries",  to: "/trending?filter=documentary", filter: "documentary" },
];

function TopNav() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const onTrending = location.pathname === "/trending";
  const currentFilter = searchParams.get("filter") || "all";

  function isActive(item) {
    if (item.id === "home") return location.pathname === "/home";
    if (!onTrending) return false;
    return currentFilter === item.filter;
  }

  return (
    <nav className="nav-menu" aria-label="Category navigation">
      <ul className="nav-menu-list">
        {CATEGORY_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              to={item.to}
              className={`nav-menu-link${isActive(item) ? " active" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const FEATURED = {
  title: "The Last of Us",
  type: "tv",
  genre: "Drama",
  year: 2023,
  score: 9.2,
  views: "2.4M",
  description:
    "A hardened survivor and a teenage girl traverse a post-apocalyptic world filled with infected and ruthless survivors fighting for dominance and survival.",
  poster: "https://via.placeholder.com/1280x520/0d0d1e/3a3a5c?text=The+Last+of+Us",
};

const TRENDING_ROW = [
  { id: "tr-1", title: "The Last of Us",         type: "tv",    genre: "Drama",     score: 9.2, year: 2023, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=TLOU" },
  { id: "tr-2", title: "Oppenheimer",             type: "movie", genre: "Drama",     score: 8.9, year: 2023, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=OPP" },
  { id: "tr-3", title: "Severance",               type: "tv",    genre: "Thriller",  score: 8.7, year: 2022, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=SEV" },
  { id: "tr-4", title: "Dune: Part Two",          type: "movie", genre: "Sci-Fi",    score: 8.5, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=Dune" },
  { id: "tr-5", title: "The Bear",                type: "tv",    genre: "Drama",     score: 8.6, year: 2022, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=Bear" },
  { id: "tr-6", title: "Succession",              type: "tv",    genre: "Drama",     score: 9.0, year: 2018, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=Succ" },
  { id: "tr-7", title: "Poor Things",             type: "movie", genre: "Fantasy",   score: 8.0, year: 2023, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=PT" },
  { id: "tr-8", title: "Fallout",                 type: "tv",    genre: "Sci-Fi",    score: 8.5, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=FALL" },
];

const NEW_RELEASES = [
  { id: "nr-1", title: "Fallout",                 type: "tv",    genre: "Sci-Fi",    score: 8.5, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=FALL" },
  { id: "nr-2", title: "Dune: Part Two",          type: "movie", genre: "Sci-Fi",    score: 8.5, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=Dune" },
  { id: "nr-3", title: "House of the Dragon S2",  type: "tv",    genre: "Fantasy",   score: 7.8, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=HOTD" },
  { id: "nr-4", title: "Civil War",               type: "movie", genre: "Action",    score: 7.5, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=CW" },
  { id: "nr-5", title: "Shogun",                  type: "tv",    genre: "Historical",score: 8.7, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=SHO" },
  { id: "nr-6", title: "Furiosa",                 type: "movie", genre: "Action",    score: 7.8, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=FUR" },
  { id: "nr-7", title: "A Quiet Place: Day One",  type: "movie", genre: "Horror",    score: 7.2, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=QP" },
  { id: "nr-8", title: "The Acolyte",             type: "tv",    genre: "Sci-Fi",    score: 6.4, year: 2024, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=ACOL" },
];

const TOP_RATED = [
  { id: "top-1", title: "Breaking Bad",           type: "tv",    genre: "Crime",     score: 9.5, year: 2008, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=BB" },
  { id: "top-2", title: "The Wire",               type: "tv",    genre: "Crime",     score: 9.4, year: 2002, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=Wire" },
  { id: "top-3", title: "Chernobyl",              type: "tv",    genre: "Drama",     score: 9.4, year: 2019, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=CHR" },
  { id: "top-4", title: "The Sopranos",           type: "tv",    genre: "Crime",     score: 9.2, year: 1999, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=SOP" },
  { id: "top-5", title: "Interstellar",           type: "movie", genre: "Sci-Fi",    score: 9.0, year: 2014, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=INT" },
  { id: "top-6", title: "The Dark Knight",        type: "movie", genre: "Action",    score: 9.0, year: 2008, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=TDK" },
  { id: "top-7", title: "Peaky Blinders",         type: "tv",    genre: "Crime",     score: 8.9, year: 2013, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=PB" },
  { id: "top-8", title: "Parasite",               type: "movie", genre: "Thriller",  score: 8.5, year: 2019, poster: "https://via.placeholder.com/130x190/1a1a2e/e0e0e0?text=PAR" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function RowCard({ item }) {
  return (
    <div className="row-card">
      <div className="row-card-poster-wrap">
        <img className="row-card-poster" src={item.poster} alt={item.title} loading="lazy" />
        <div className="row-card-overlay" aria-hidden="true">
          <span className="row-card-play-btn"><i className="bx bx-play"></i></span>
        </div>
        <span className="row-card-score">
          <i className="bx bxs-star"></i>{item.score}
        </span>
        <span className="row-card-type-badge">
          {item.type === "tv" ? "Series" : "Movie"}
        </span>
      </div>
      <div className="row-card-body">
        <span className="row-card-title">{item.title}</span>
        <span className="row-card-meta">{item.genre} · {item.year}</span>
      </div>
    </div>
  );
}

function ContinueCard({ item }) {
  const progress = 45;
  return (
    <div className="continue-card">
      <div className="continue-card-thumb-wrap">
        <img className="continue-card-thumb" src={item.poster} alt={item.title} loading="lazy" />
        <div className="continue-card-overlay" aria-hidden="true">
          <span className="continue-card-play-btn"><i className="bx bx-play"></i></span>
        </div>
        {item.episode && item.episode !== "-" && (
          <span className="continue-card-episode">{item.episode}</span>
        )}
        <div className="continue-progress-bar">
          <div className="continue-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="continue-card-body">
        <span className="continue-card-title">{item.title}</span>
        <span className="continue-card-meta">{item.genre}</span>
      </div>
    </div>
  );
}

function ContentRow({ title, icon, items, link, CardComponent = RowCard }) {
  return (
    <section className="content-row">
      <div className="content-row-header">
        <h2 className="content-row-title">
          <i className={`bx ${icon}`} aria-hidden="true"></i>
          {title}
        </h2>
        {link && (
          <Link to={link} className="content-row-see-all">
            See All <i className="bx bx-chevron-right"></i>
          </Link>
        )}
      </div>
      <div className="content-row-scroll">
        {items.map((item) => (
          <CardComponent key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();

  const continueWatching = user?.watchList?.filter((i) => i.status === "watching") ?? [];

  return (
    <SidebarLayout navbarContent={<TopNav />}>
      <div className="home-dashboard">

        {/* ── Featured Banner ── */}
        <section className="featured-banner" aria-label="Featured content">
          <img
            className="featured-backdrop"
            src={FEATURED.poster}
            alt=""
            aria-hidden="true"
          />
          <div className="featured-gradient" aria-hidden="true" />
          <div className="featured-info">
            <div className="featured-badges">
              <span className="featured-badge featured-badge--type">
                {FEATURED.type === "tv" ? "Series" : "Movie"}
              </span>
              <span className="featured-badge featured-badge--meta">{FEATURED.genre}</span>
              <span className="featured-badge featured-badge--meta">{FEATURED.year}</span>
            </div>
            <h1 className="featured-title">{FEATURED.title}</h1>
            <p className="featured-desc">{FEATURED.description}</p>
            <div className="featured-stats">
              <span className="featured-stat featured-stat--score">
                <i className="bx bxs-star" aria-hidden="true"></i>
                {FEATURED.score}
              </span>
              <span className="featured-stat featured-stat--views">
                <i className="bx bx-show" aria-hidden="true"></i>
                {FEATURED.views} views
              </span>
            </div>
            <div className="featured-actions">
              <Button variant="primary" size="large">
                <i className="bx bx-play" aria-hidden="true"></i>
                Watch Now
              </Button>
              <Button variant="ghost" size="large">
                <i className="bx bx-plus" aria-hidden="true"></i>
                Add to List
              </Button>
            </div>
          </div>
        </section>

        <div className="home-rows">

          {/* ── Continue Watching ── */}
          {isAuthenticated && continueWatching.length > 0 && (
            <ContentRow
              title="Continue Watching"
              icon="bx-time-five"
              items={continueWatching}
              link="/profile"
              CardComponent={ContinueCard}
            />
          )}

          {/* ── Trending Now ── */}
          <ContentRow
            title="Trending Now"
            icon="bx-trending-up"
            items={TRENDING_ROW}
            link="/trending"
          />

          {/* ── New Releases ── */}
          <ContentRow
            title="New Releases"
            icon="bx-star"
            items={NEW_RELEASES}
            link="/trending?filter=all"
          />

          {/* ── Top Rated ── */}
          <ContentRow
            title="Top Rated"
            icon="bx-award"
            items={TOP_RATED}
          />

          {/* ── Guest CTA ── */}
          {!isAuthenticated && (
            <section className="home-cta">
              <div className="home-cta-inner">
                <i className="bx bx-play-circle home-cta-icon" aria-hidden="true"></i>
                <h2 className="home-cta-title">Start Watching Today</h2>
                <p className="home-cta-desc">
                  Sign in to track your watchlist, get personalised recommendations,
                  and pick up exactly where you left off.
                </p>
                <Button variant="primary" size="large" onClick={() => navigate("/login")}>
                  Sign In to Your Account
                </Button>
              </div>
            </section>
          )}

        </div>
      </div>
    </SidebarLayout>
  );
}
