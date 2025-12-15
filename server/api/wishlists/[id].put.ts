export default defineEventHandler<any>(async (event): Promise<any> => {
  const config: any = useRuntimeConfig()
  const userData = await readBody(event)
  const id = getRouterParam(event, 'id')
  const authHeader = getHeader(event, 'Authorization')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing wishlist id' })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/wishlist/${id}`, {
      method: 'PUT',
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
