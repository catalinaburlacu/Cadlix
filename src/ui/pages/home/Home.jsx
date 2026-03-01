import { Link, useLocation, useSearchParams } from "react-router-dom";
import Button from "../../../components/common/Button.jsx";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "./Home.css";

const CATEGORY_NAV_ITEMS = [
  { id: "home",          label: "Home",          to: "/home",                    filter: null },
  { id: "trending",      label: "Trending",       to: "/trending",                filter: "all" },
  { id: "movies",        label: "Movies",         to: "/trending?filter=movie",   filter: "movie" },
  { id: "series",        label: "Series",         to: "/trending?filter=tv",      filter: "tv" },
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

export default function Home() {
  return (
    <SidebarLayout navbarContent={<TopNav />}>
      <div className="page-content">
        <section className="hero-section">
          <h1 className="hero-title">Welcome to Cadlix!</h1>
          <p className="hero-subtitle">
            Discover movies, series, and more — all in one place
          </p>
          <div className="hero-actions">
            <Button variant="primary" size="large">
              Get Started
            </Button>
            <Button variant="ghost" size="large">
              Learn More
            </Button>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Recently Added</h2>
          <div className="content-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="content-card">
                <div className="content-card-image" />
                <div className="content-card-info">
                  <h3 className="content-card-title">Title {item}</h3>
                  <p className="content-card-meta">Action | Adventure</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
}
