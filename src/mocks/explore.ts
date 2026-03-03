export interface CarouselItem {
  title: string
  meta: string
}

interface ExploreCategory {
  id: string
  title: string
  icon: string
  items: string[]
}

interface CarouselRow {
  id: string
  title: string
  items: CarouselItem[]
}

export const exploreCategories: ExploreCategory[] = [
  {
    id: 'anime',
    title: 'Anime',
    icon: 'bx-tv',
    items: ['Shonen', 'Seinen', 'Fantasy', 'Romance', 'Slice of Life', 'Sci-Fi'],
  },
  {
    id: 'films',
    title: 'Films',
    icon: 'bx-movie-play',
    items: ['Action', 'Drama', 'Comedy', 'Thriller', 'Animation', 'Documentary'],
  },
  {
    id: 'serials',
    title: 'Series',
    icon: 'bx-camera-movie',
    items: ['Crime', 'Mystery', 'Adventure', 'Comedy', 'Historical', 'Family'],
  },
  {
    id: 'country',
    title: 'By Country',
    icon: 'bx-world',
    items: ['Japan', 'USA', 'South Korea', 'France', 'Spain', 'UK'],
  },
  {
    id: 'studio',
    title: 'By Studio',
    icon: 'bx-buildings',
    items: ['MAPPA', 'Ufotable', 'Bones', 'Madhouse', 'A24', 'Warner Bros.'],
  },
]

export const carouselRows: CarouselRow[] = [
  {
    id: 'anime-action',
    title: 'Anime - Action',
    items: [
      { title: 'Attack on Titan', meta: 'Anime' },
      { title: 'Jujutsu Kaisen', meta: 'Anime' },
      { title: 'Demon Slayer', meta: 'Anime' },
      { title: 'My Hero Academia', meta: 'Anime' },
      { title: 'Bleach', meta: 'Anime' },
      { title: 'One Punch Man', meta: 'Anime' },
      { title: 'Chainsaw Man', meta: 'Anime' },
      { title: 'Solo Leveling', meta: 'Anime' },
      { title: 'Fullmetal Alchemist', meta: 'Anime' },
      { title: 'Mob Psycho 100', meta: 'Anime' },
    ],
  },
  {
    id: 'anime-romance',
    title: 'Anime - Romance',
    items: [
      { title: 'Your Name', meta: 'Anime' },
      { title: 'Horimiya', meta: 'Anime' },
      { title: 'Kaguya-sama', meta: 'Anime' },
      { title: 'Toradora', meta: 'Anime' },
      { title: 'Clannad', meta: 'Anime' },
      { title: 'Fruits Basket', meta: 'Anime' },
      { title: 'A Silent Voice', meta: 'Anime' },
      { title: 'Weathering With You', meta: 'Anime' },
      { title: 'Kimi ni Todoke', meta: 'Anime' },
      { title: 'ReLIFE', meta: 'Anime' },
    ],
  },
  {
    id: 'films-action',
    title: 'Films - Action',
    items: [
      { title: 'Mad Max Fury Road', meta: 'Film' },
      { title: 'John Wick', meta: 'Film' },
      { title: 'Gladiator', meta: 'Film' },
      { title: 'Top Gun Maverick', meta: 'Film' },
      { title: 'The Batman', meta: 'Film' },
      { title: 'The Dark Knight', meta: 'Film' },
      { title: 'Dune Part Two', meta: 'Film' },
      { title: 'Mission Impossible', meta: 'Film' },
      { title: 'The Matrix', meta: 'Film' },
      { title: 'Inception', meta: 'Film' },
    ],
  },
  {
    id: 'films-drama',
    title: 'Films - Drama',
    items: [
      { title: 'Interstellar', meta: 'Film' },
      { title: 'The Godfather', meta: 'Film' },
      { title: 'Fight Club', meta: 'Film' },
      { title: 'Whiplash', meta: 'Film' },
      { title: 'The Social Network', meta: 'Film' },
      { title: 'Parasite', meta: 'Film' },
      { title: 'La La Land', meta: 'Film' },
      { title: 'Forrest Gump', meta: 'Film' },
      { title: 'Joker', meta: 'Film' },
      { title: 'Oppenheimer', meta: 'Film' },
    ],
  },
  {
    id: 'series-crime',
    title: 'Series - Crime',
    items: [
      { title: 'Breaking Bad', meta: 'Series' },
      { title: 'Mindhunter', meta: 'Series' },
      { title: 'True Detective', meta: 'Series' },
      { title: 'Narcos', meta: 'Series' },
      { title: 'Ozark', meta: 'Series' },
      { title: 'Peaky Blinders', meta: 'Series' },
      { title: 'Better Call Saul', meta: 'Series' },
      { title: 'Money Heist', meta: 'Series' },
      { title: 'The Sopranos', meta: 'Series' },
      { title: 'Fargo', meta: 'Series' },
    ],
  },
  {
    id: 'series-scifi',
    title: 'Series - Sci-Fi',
    items: [
      { title: 'Dark', meta: 'Series' },
      { title: 'Stranger Things', meta: 'Series' },
      { title: 'The Expanse', meta: 'Series' },
      { title: 'Severance', meta: 'Series' },
      { title: 'Silo', meta: 'Series' },
      { title: 'Westworld', meta: 'Series' },
      { title: 'Black Mirror', meta: 'Series' },
      { title: 'Foundation', meta: 'Series' },
      { title: 'Lost in Space', meta: 'Series' },
      { title: 'Altered Carbon', meta: 'Series' },
    ],
  },
]
