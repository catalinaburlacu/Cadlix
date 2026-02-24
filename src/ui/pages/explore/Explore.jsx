import { useState, useEffect } from "react";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "../home/Home.css";
import "./Explore.css";

const exploreCategories = [
  {
    id: "anime",
    title: "Anime",
    icon: "bx-tv",
    items: ["Shonen", "Seinen", "Fantasy", "Romance", "Slice of Life", "Sci-Fi"],
  },
  {
    id: "filme",
    title: "Filme",
    icon: "bx-movie-play",
    items: ["Actiune", "Drama", "Comedie", "Thriller", "Animatie", "Documentar"],
  },
  {
    id: "seriale",
    title: "Seriale",
    icon: "bx-camera-movie",
    items: ["Crime", "Mystery", "Adventure", "Comedy", "Historical", "Family"],
  },
  {
    id: "tara",
    title: "Dupa tara",
    icon: "bx-world",
    items: ["Japonia", "SUA", "Coreea", "Franta", "Spania", "UK"],
  },
  {
    id: "studio",
    title: "Dupa studiouri producatoare",
    icon: "bx-buildings",
    items: ["MAPPA", "Ufotable", "Bones", "Madhouse", "A24", "Warner Bros."],
  },
];

const carouselRows = [
  {
    id: "anime-action",
    title: "Anime - Action",
    items: [
      { title: "Attack on Titan", meta: "Anime" },
      { title: "Jujutsu Kaisen", meta: "Anime" },
      { title: "Demon Slayer", meta: "Anime" },
      { title: "My Hero Academia", meta: "Anime" },
      { title: "Bleach", meta: "Anime" },
      { title: "One Punch Man", meta: "Anime" },
      { title: "Chainsaw Man", meta: "Anime" },
      { title: "Solo Leveling", meta: "Anime" },
      { title: "Fullmetal Alchemist", meta: "Anime" },
      { title: "Mob Psycho 100", meta: "Anime" },
    ],
  },
  {
    id: "anime-romance",
    title: "Anime - Romance",
    items: [
      { title: "Your Name", meta: "Anime" },
      { title: "Horimiya", meta: "Anime" },
      { title: "Kaguya-sama", meta: "Anime" },
      { title: "Toradora", meta: "Anime" },
      { title: "Clannad", meta: "Anime" },
      { title: "Fruits Basket", meta: "Anime" },
      { title: "A Silent Voice", meta: "Anime" },
      { title: "Weathering With You", meta: "Anime" },
      { title: "Kimi ni Todoke", meta: "Anime" },
      { title: "ReLIFE", meta: "Anime" },
    ],
  },
  {
    id: "filme-action",
    title: "Filme - Action",
    items: [
      { title: "Mad Max Fury Road", meta: "Film" },
      { title: "John Wick", meta: "Film" },
      { title: "Gladiator", meta: "Film" },
      { title: "Top Gun Maverick", meta: "Film" },
      { title: "The Batman", meta: "Film" },
      { title: "The Dark Knight", meta: "Film" },
      { title: "Dune Part Two", meta: "Film" },
      { title: "Mission Impossible", meta: "Film" },
      { title: "The Matrix", meta: "Film" },
      { title: "Inception", meta: "Film" },
    ],
  },
  {
    id: "filme-drama",
    title: "Filme - Drama",
    items: [
      { title: "Interstellar", meta: "Film" },
      { title: "The Godfather", meta: "Film" },
      { title: "Fight Club", meta: "Film" },
      { title: "Whiplash", meta: "Film" },
      { title: "The Social Network", meta: "Film" },
      { title: "Parasite", meta: "Film" },
      { title: "La La Land", meta: "Film" },
      { title: "Forrest Gump", meta: "Film" },
      { title: "Joker", meta: "Film" },
      { title: "Oppenheimer", meta: "Film" },
    ],
  },
  {
    id: "seriale-crime",
    title: "Seriale - Crime",
    items: [
      { title: "Breaking Bad", meta: "Serial" },
      { title: "Mindhunter", meta: "Serial" },
      { title: "True Detective", meta: "Serial" },
      { title: "Narcos", meta: "Serial" },
      { title: "Ozark", meta: "Serial" },
      { title: "Peaky Blinders", meta: "Serial" },
      { title: "Better Call Saul", meta: "Serial" },
      { title: "Money Heist", meta: "Serial" },
      { title: "The Sopranos", meta: "Serial" },
      { title: "Fargo", meta: "Serial" },
    ],
  },
  {
    id: "seriale-scifi",
    title: "Seriale - Sci-Fi",
    items: [
      { title: "Dark", meta: "Serial" },
      { title: "Stranger Things", meta: "Serial" },
      { title: "The Expanse", meta: "Serial" },
      { title: "Severance", meta: "Serial" },
      { title: "Silo", meta: "Serial" },
      { title: "Westworld", meta: "Serial" },
      { title: "Black Mirror", meta: "Serial" },
      { title: "Foundation", meta: "Serial" },
      { title: "Lost in Space", meta: "Serial" },
      { title: "Altered Carbon", meta: "Serial" },
    ],
  },
];

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
          <h2>Cauta rapid continutul preferat</h2>
          <p>Toate titlurile sunt impartite pe categorii pentru filtrare rapida si organizare clara.</p>
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
