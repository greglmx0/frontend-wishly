export default defineEventHandler<any>(async (event): Promise<any> => {
  const config: any = useRuntimeConfig()

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/wishlists`, {
      method: 'DELETE',
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'Failed to fetch wishlists',
    })
  }
})
