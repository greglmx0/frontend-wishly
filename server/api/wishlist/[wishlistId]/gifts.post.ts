export default defineEventHandler<any>(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'Authorization')
  const wishlistId = getRouterParam(event, 'wishlistId')
  const body = await readBody(event)

  if (!wishlistId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing wishlistId' })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/wishlist/${wishlistId}/gifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body,
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'Failed to create gift',
    })
  }
})
