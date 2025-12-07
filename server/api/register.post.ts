export default defineEventHandler((event) => {
  return async (userData: { username: string; email: string; password: string }) => {
    const config = useRuntimeConfig()

    return $fetch(`${config.public.apiBaseUrl}/register`, {
      method: 'POST',
      body: userData,
    })
  }
})
