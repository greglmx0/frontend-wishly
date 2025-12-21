import { ref, readonly, type Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
const { authHeaders } = useAuth()

/**
 * Composable for scraping product information from URLs
 */
export type ScrapedProduct = {
  name: string | null
  price: number | null
  images: string[]
  description: string | null
}

/**
 * Return type of useUrlScraper
 * @property loading - Indicates if a scrape operation is in progress
 * @property error - Error message if scraping failed
 * @property scrapeUrl - Function to scrape a given URL
 * @property reset - Function to reset the scraper state
 */
export type UseUrlScraperReturn = {
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  scrapeUrl: (url: string) => Promise<ScrapedProduct | null>
  reset: () => void
}

/**
 * Use URL scraper composable
 * @return Scraper state and methods
 */
export const useUrlScraper: () => UseUrlScraperReturn = () => {
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Scrape a URL and extract product metadata
   */
  const scrapeUrl: (url: string) => Promise<ScrapedProduct | null> = async (
    url: string,
  ): Promise<ScrapedProduct | null> => {
    loading.value = true
    error.value = null

    try {
      // Validate URL
      try {
        new URL(url)
      } catch {
        throw new Error('URL invalide')
      }

      const response: { success: boolean; data: ScrapedProduct } = await $fetch('/api/scrape-url', {
        method: 'POST',
        body: { url },
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      })

      if (!response.success) {
        throw new Error('Impossible de scraper la page')
      }

      return response.data
    } catch (err) {
      const message: string = err instanceof Error ? err.message : 'Une erreur est survenue'
      error.value = message
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset scraper state
   */
  const reset: () => void = () => {
    loading.value = false
    error.value = null
  }

  return {
    scrapeUrl,
    loading: readonly(loading),
    error: readonly(error),
    reset,
  }
}
