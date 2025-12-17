export default defineEventHandler<any>(async (event): Promise<any> => {
  const wishlistId = getRouterParam(event, 'wishlistId')
  const authHeader = getHeader(event, 'Authorization')
  const config = useRuntimeConfig()

  if (!wishlistId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing wishlistId' })
  }

  try {
    const res = await $fetch<boolean>(`${config.public.apiBaseUrl}/api/wishlist/${wishlistId}/check-owner`, {
      method: 'GET',
      headers: authHeader ? { Authorization: authHeader } : undefined,
    })
    return { isOwner: res }
  } catch (err: any) {
    console.error(err)
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.statusText || 'Ownership check failed',
      data: err?.data,
    })
  }
})
