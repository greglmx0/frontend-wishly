export default defineEventHandler<any>(async (event): Promise<any> => {
  const id = event.context.params?.id as string
  const auth = getRequestHeader(event, 'authorization')

  // Forward to backend controller. Assume endpoint: GET /wishlists/:id/check-owner
  const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/wishlist/${id}/check-owner`

  try {
    const res = await $fetch<{ isOwner: boolean }>(backendUrl, {
      method: 'GET',
      headers: auth ? { Authorization: auth } : undefined,
    })
    return { isOwner: !!res.isOwner }
  } catch (err: any) {
    // Surface backend error shape
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.statusText || 'Ownership check failed',
      data: err?.data,
    })
  }
})
