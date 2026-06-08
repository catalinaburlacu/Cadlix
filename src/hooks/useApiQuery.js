import { useEffect, useState } from 'react'

export function useApiQuery(fetcher, dependencies = [], initialData = null) {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher(controller.signal)
        if (active) {
          setData(result)
        }
      } catch (fetchError) {
        if (fetchError?.name === 'AbortError') {
          return
        }

        if (active) {
          setError(fetchError)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
      controller.abort()
    }
  }, dependencies)

  return { data, error, loading, setData }
}