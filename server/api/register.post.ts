export default defineEventHandler<any>(async (event): Promise<any> => {
  const config: any = useRuntimeConfig()
  const userData = await readBody(event)

  try {
    const response: any = await $fetch(`${config.public.apiBaseUrl}/api/register`, {
      method: 'POST',
      body: userData,
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || 'Registration failed',
    })
  }
})
