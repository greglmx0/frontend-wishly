export default defineEventHandler<any>(async (event): Promise<any> => {
  const config: any = useRuntimeConfig()
  const body = await readBody(event)
  const authHeader = getHeader(event, 'Authorization')

  if (!body.url) {
    throw createError({ statusCode: 400, statusMessage: 'Missing URL in request body' })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/scrape-url`, {
      method: 'POST',
      headers: authHeader ? { Authorization: authHeader } : undefined,
      body: body,
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'URL scraping failed',
    })
  }
})
