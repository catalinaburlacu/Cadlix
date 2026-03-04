import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchMovies } from '../../../mocks/explore.js'
import './SearchBar.css'

const DEBOUNCE_DELAY = 350

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY)

  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) return []
    setIsLoading(true)
    const searchResults = searchMovies(debouncedQuery)
    setIsLoading(false)
    return searchResults
  }, [debouncedQuery])

  const handleClear = useCallback(() => {
    setQuery('')
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }, [])

  const handleSelect = useCallback(
    (id) => {
      navigate(`/movie/${id}`)
      setQuery('')
      setIsFocused(false)
      setHighlightedIndex(-1)
    },
    [navigate]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (!results.length) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && results[highlightedIndex]) {
            handleSelect(results[highlightedIndex].id)
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsFocused(false)
          inputRef.current?.blur()
          break
        default:
          break
      }
    },
    [results, highlightedIndex, handleSelect]
  )

  useEffect(() => {
    if (highlightedIndex >= 0 && resultsRef.current) {
      const highlightedEl = resultsRef.current.querySelector(`[data-index="${highlightedIndex}"]`)
      highlightedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [highlightedIndex])

  const showResults = isFocused && query.trim().length >= 2
  const showEmpty = showResults && !isLoading && results.length === 0

  return (
    <div className={`search-bar-container ${isFocused ? 'focused' : ''}`}>
      <div className="search-bar-input-wrapper">
        <i className="bx bx-search search-bar-icon" aria-hidden="true"></i>
        <input
          ref={inputRef}
          type="text"
          className="search-bar-input"
          placeholder="Search movies, series, or actors..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlightedIndex(-1)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          aria-label="Search movies and series"
          aria-expanded={showResults}
          aria-controls="search-results"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className="search-bar-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <i className="bx bx-x" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-bar-dropdown" ref={resultsRef} role="listbox" id="search-results">
          {isLoading ? (
            <div className="search-bar-loading">
              <i className="bx bx-loader-alt bx-spin" aria-hidden="true"></i>
              <span>Searching...</span>
            </div>
          ) : showEmpty ? (
            <div className="search-bar-empty">
              <i className="bx bx-search-alt" aria-hidden="true"></i>
              <span>No results found for "{query}"</span>
            </div>
          ) : (
            results.map((item, index) => (
              <div
                key={item.id}
                data-index={index}
                className={`search-bar-result ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelect(item.id)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <img
                  src={item.poster}
                  alt=""
                  className="search-bar-result-poster"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x85?text=No+Img'
                  }}
                />
                <div className="search-bar-result-info">
                  <span className="search-bar-result-title">{item.title}</span>
                  <div className="search-bar-result-meta">
                    <span className="search-bar-result-year">{item.year}</span>
                    <span className="search-bar-result-type">{item.type}</span>
                    {item.rating && (
                      <span className="search-bar-result-rating">
                        <i className="bx bxs-star" aria-hidden="true"></i>
                        {item.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
