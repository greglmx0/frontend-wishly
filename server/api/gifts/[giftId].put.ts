export default defineEventHandler<any>(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'Authorization')
  const giftId = getRouterParam(event, 'giftId')
  const body = await readBody(event)

  if (!giftId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing giftId' })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/gifts/${giftId}`, {
      method: 'PUT',
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
      statusMessage: error.data?.message || 'Failed to update gift',
    })
  }
})
