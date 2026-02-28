import { useUser } from "../../../context/useUser.js";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "../home/Home.css";
import "./History.css";

function formatWatchDate(value) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

export default function History() {
  const { user } = useUser();
  const historyEntries = user?.watchHistory || [];

  return (
    <SidebarLayout
      pageClass="history-page"
      navbarContent={<h1 className="history-heading">Watch History</h1>}
    >
      <div className="page-content history-content">
        <section className="history-intro">
          <h2>Viewed Movies and Series</h2>
          <p>Track what you watched, which series/episode, and the exact viewing moment.</p>
        </section>

        <section className="history-list" aria-label="Viewing history">
          {historyEntries.length === 0 ? (
            <div className="history-empty">
              <i className="bx bx-history"></i>
              <p>No watch history yet.</p>
            </div>
          ) : (
            historyEntries.map((entry) => (
              <article key={entry.id} className="history-card">
                <div className="history-main">
                  <h3>{entry.title}</h3>
                  <span className={`history-type history-type--${entry.category.toLowerCase()}`}>
                    {entry.category}
                  </span>
                </div>
                <div className="history-meta">
                  <p><strong>Series:</strong> {entry.series || "-"}</p>
                  <p><strong>Episode:</strong> {entry.episode || "-"}</p>
                  <p><strong>Moment:</strong> {entry.progress || "-"}</p>
                  <p><strong>Watched At:</strong> {formatWatchDate(entry.watchedAt)}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}
