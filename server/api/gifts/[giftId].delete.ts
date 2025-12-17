export default defineEventHandler<any>(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'Authorization')
  const giftId = getRouterParam(event, 'giftId')

  if (!giftId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing giftId' })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/gifts/${giftId}`, {
      method: 'DELETE',
      headers: authHeader ? { Authorization: authHeader } : undefined,
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'Failed to delete gift',
    })
  }
})
