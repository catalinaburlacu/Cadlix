import Button from "../../../components/common/Button.jsx";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "./Home.css";

const CATEGORY_NAV_ITEMS = [
  { id: "home", label: "Home", href: "#home" },
  { id: "trending", label: "Trending", href: "#trending" },
  { id: "movies", label: "Movies", href: "#movies" },
  { id: "series", label: "Series", href: "#series" },
  { id: "documentaries", label: "Documentaries", href: "#documentaries" },
];

export default function Home() {
  const topNav = (
    <nav className="nav-menu" aria-label="Category navigation">
      <ul className="nav-menu-list">
        {CATEGORY_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a href={item.href} className="nav-menu-link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <SidebarLayout navbarContent={topNav}>
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
