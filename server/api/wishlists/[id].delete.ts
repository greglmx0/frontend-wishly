export default defineEventHandler<any>(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'Authorization')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing wishlist id' })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/wishlist/${id}`, {
      method: 'DELETE',
      headers: authHeader ? { Authorization: authHeader } : undefined,
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'Failed to delete wishlist',
    })
  }
})
