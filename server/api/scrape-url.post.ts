/**
 * Scrape product information from a URL
 * Supports multiple e-commerce sites with generic metadata extraction
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url || typeof url !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required',
    })
  }

  try {
    // Validate URL format
    new URL(url)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL format',
    })
  }

  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()

    // Extract metadata using HTML parsing
    const metadata = extractMetadata(html, url)

    return {
      success: true,
      data: metadata,
    }
  } catch (error) {
    console.error('Scraping error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  }
})

/**
 * Extract product metadata from HTML
 */
function extractMetadata(
  html: string,
  url: string,
): {
  name: string | null
  price: number | null
  images: string[]
  description: string | null
} {
  // Use regex to find common meta tags and structured data
  const metadata = {
    name: null as string | null,
    price: null as number | null,
    images: [] as string[],
    description: null as string | null,
  }

  // Extract name from various sources
  metadata.name =
    extractFromMeta(html, 'og:title') ||
    extractFromMeta(html, 'twitter:title') ||
    extractFromMeta(html, 'title') ||
    extractTitle(html)

  // Extract description
  metadata.description =
    extractFromMeta(html, 'og:description') ||
    extractFromMeta(html, 'description') ||
    extractFromMeta(html, 'twitter:description')

  // Extract images
  const ogImage = extractFromMeta(html, 'og:image')
  if (ogImage) {
    metadata.images.push(normalizeImageUrl(ogImage, url))
  }

  const twitterImage = extractFromMeta(html, 'twitter:image')
  if (twitterImage) {
    metadata.images.push(normalizeImageUrl(twitterImage, url))
  }

  // Find additional images from img tags
  const imgUrls = extractImages(html, url)
  metadata.images.push(...imgUrls)

  // Remove duplicates
  metadata.images = [...new Set(metadata.images)].filter((img) => img.length > 0)

  // Extract price
  metadata.price = extractPrice(html)

  return metadata
}

/**
 * Extract value from meta tags
 */
function extractFromMeta(html: string, property: string): string | null {
  const patterns = [
    `<meta\\s+property=["']${property}["']\\s+content=["']([^"']+)["']`,
    `<meta\\s+name=["']${property}["']\\s+content=["']([^"']+)["']`,
    `<meta\\s+content=["']([^"']+)["']\\s+property=["']${property}["']`,
    `<meta\\s+content=["']([^"']+)["']\\s+name=["']${property}["']`,
  ]

  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'i')
    const match = html.match(regex)
    if (match && match[1]) {
      return decodeHTMLEntities(match[1].trim())
    }
  }

  return null
}

/**
 * Extract title from <title> tag
 */
function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? decodeHTMLEntities(match[1].trim()) : null
}

/**
 * Extract image URLs from img tags
 */
function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = []
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi

  let match
  while ((match = imgRegex.exec(html)) !== null) {
    const imgUrl = match[1]
    if (imgUrl && !imgUrl.includes('data:') && !imgUrl.includes('1x1')) {
      images.push(normalizeImageUrl(imgUrl, baseUrl))
    }
  }

  return images.slice(0, 10) // Limit to 10 images
}

/**
 * Extract price from HTML
 */
function extractPrice(html: string): number | null {
  // Look for common price patterns
  const patterns = [
    /[\$€£₹]\s*(\d+[.,]\d{2})/,
    /price["']?\s*:\s*["']?(\d+[.,]\d{2})["']?/i,
    /(\d+[.,]\d{2})\s*[\$€£₹]/,
    /"price"\s*:\s*"(\d+[.,]\d{2})"/,
    /data-price=["'](\d+[.,]\d{2})["']/,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      const priceStr = match[1].replace(',', '.')
      const price = parseFloat(priceStr)
      if (!isNaN(price) && price > 0) {
        return price
      }
    }
  }

  return null
}

/**
 * Normalize image URL to absolute URL
 */
function normalizeImageUrl(url: string, baseUrl: string): string {
  // Already absolute
  if (url.startsWith('http')) {
    return url
  }

  // Protocol-relative
  if (url.startsWith('//')) {
    const base = new URL(baseUrl)
    return `${base.protocol}//${url.substring(2)}`
  }

  // Relative URL
  try {
    const base = new URL(baseUrl)
    return new URL(url, base.href).href
  } catch {
    return url
  }
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  }

  let decoded = text
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }

  return decoded
}
