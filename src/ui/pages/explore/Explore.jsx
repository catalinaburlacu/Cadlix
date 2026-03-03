import { useState, useEffect } from "react";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import { exploreCategories, carouselRows } from "../../../mocks/explore.js";
import "../home/Home.css";
import "./Explore.css";

function getVisibleItems(items, start, count) {
  return Array.from({ length: count }, (_, offset) => {
    const index = (start + offset) % items.length;
    return items[index];
  });
}

export default function Explore() {
  const [carouselIndex, setCarouselIndex] = useState(() =>
    Object.fromEntries(carouselRows.map((row) => [row.id, 0]))
  );

  useEffect(() => {
    const timeoutIds = [];
    const intervalIds = [];

    carouselRows.forEach((row, rowIndex) => {
      const startDelay = rowIndex * 2000;
      const rotationInterval = 8000 + rowIndex * 1200;
      const stepSize = rowIndex % 2 === 0 ? 1 : 2;

      const timeoutId = setTimeout(() => {
        const intervalId = setInterval(() => {
          setCarouselIndex((prev) => ({
            ...prev,
            [row.id]: ((prev[row.id] ?? 0) + stepSize) % row.items.length,
          }));
        }, rotationInterval);
        intervalIds.push(intervalId);
      }, startDelay);

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
      intervalIds.forEach(clearInterval);
    };
  }, []);

  return (
    <SidebarLayout
      pageClass="explore-page"
      navbarContent={<h1 className="explore-heading">Explore by Categories</h1>}
    >
      <div className="page-content explore-content">
        <section className="explore-intro">
          <h2>Quickly search for your favorite content</h2>
          <p>Browse titles by category for faster discovery and better organization.</p>
        </section>

        <section className="explore-categories-grid">
          {exploreCategories.map((category) => (
            <article key={category.id} className="explore-category-card" id={category.id}>
              <div className="explore-card-head">
                <div className="explore-card-icon">
                  <i className={`bx ${category.icon}`}></i>
                </div>
                <h3>{category.title}</h3>
              </div>
              <div className="explore-chip-list">
                {category.items.map((item) => (
                  <button key={item} type="button" className="explore-chip">
                    {item}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="explore-carousel-section">
          <div className="explore-carousel-list">
            {carouselRows.map((row) => {
              const start = carouselIndex[row.id] ?? 0;
              const visibleItems = getVisibleItems(row.items, start, 4);

              return (
                <article key={row.id} className="media-row">
                  <header className="media-row-header">
                    <h3>{row.title}</h3>
                  </header>
                  <div className="media-row-track">
                    {visibleItems.map((item, idx) => (
                      <div key={`${row.id}-${item.title}-${start}-${idx}`} className="media-card">
                        <div className="media-card-image"></div>
                        <div className="media-card-info">
                          <h4>{item.title}</h4>
                          <p>{item.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
}
