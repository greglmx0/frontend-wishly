export default defineEventHandler<any>(async (event): Promise<any> => {
  const config: any = useRuntimeConfig()
  const userData = await readBody(event)
  const authHeader = getHeader(event, 'Authorization')

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/wishlists`, {
      method: 'POST',
      headers: authHeader ? { Authorization: authHeader } : undefined,
      body: userData,
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'Failed to fetch wishlists',
    })
  }
})
