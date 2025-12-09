import { ref, computed, readonly } from 'vue'
import type { Ref, ComputedRef } from 'vue'

/**
 * Auth response interface
 * @property token - Authentication token
 * @property user - User information (optional)
 */
type AuthResponse = {
  token: string
  user?: {
    id: string
    email: string
  }
}

/**
 * Auth error interface
 * @property statusCode - HTTP status code
 * @property message - Error message
 */
type AuthError = {
  statusCode: number
  message: string
}

const jwtToken: Ref<string | null> = ref(null)
const user: Ref<any> = ref(null)
const loading: Ref<boolean> = ref(false)
const error: Ref<AuthError | null> = ref(null)

/**
 * useAuth composable for managing authentication
 * @returns { token, user, loading, error, isAuthenticated, initializeAuth, login, register, logout, getToken, clearError }
 */
export const useAuth: () => {
  token: Readonly<Ref<string | null>>
  user: Readonly<Ref<any>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<AuthError | null>>
  isAuthenticated: ComputedRef<boolean>
  initializeAuth: () => void
  login: (email: string, password: string) => Promise<{ success: boolean; token?: string; error?: string }>
  register: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ success: boolean; token?: string; error?: string }>
  logout: () => void
  getToken: () => string | null
  clearError: () => void
} = () => {
  const TOKEN_KEY: string = 'auth_token'
  const USER_KEY: string = 'auth_user'

  /**
   * Set auth token
   */
  const token: Ref<string | null> = jwtToken
  const isAuthenticated: ComputedRef<boolean> = computed(() => !!jwtToken.value)

  /**
   * Initialize auth from localStorage
   */
  const initializeAuth: () => void = () => {
    if (typeof window !== 'undefined') {
      const storedToken: string | null = localStorage.getItem(TOKEN_KEY)
      const storedUser: string | null = localStorage.getItem(USER_KEY)
      if (storedToken) {
        token.value = storedToken
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        }
      }
    }
  }

  /**
   * Login with email and password
   */
  const login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; token?: string; error?: string }> = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response: AuthResponse = await $fetch<AuthResponse>('/api/login', {
        method: 'POST',
        body: { email, password },
      })

      token.value = response.token
      user.value = response.user || null

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, response.token)
        if (response.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.user))
        }
      }

      return { success: true, token: response.token }
    } catch (err: any) {
      const message: string = err.data?.message || err.message || 'Login failed'
      const statusCode: number = err.status || 500
      error.value = { statusCode, message }
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Register with email and password
   */
  const register: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; token?: string; error?: string }> = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response: AuthResponse = await $fetch<AuthResponse>('/api/register', {
        method: 'POST',
        body: { email, password },
      })

      token.value = response.token
      user.value = response.user || null

      console.log('Registered user:', response.user)
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, response.token)
        if (response.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.user))
        }
      }

      return { success: true, token: response.token }
    } catch (err: any) {
      const message: string = err.data?.message || err.message || 'Registration failed'
      const statusCode: number = err.status || 500
      error.value = { statusCode, message }
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout and clear auth state
   */
  const logout: () => void = () => {
    token.value = null
    user.value = null
    error.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  /**
   * Get auth token (for API headers)
   */
  const getToken: () => string | null = () => token.value

  /**
   * Clear error
   */
  const clearError: () => void = () => {
    error.value = null
  }

  return {
    token: readonly(token),
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    initializeAuth,
    login,
    register,
    logout,
    getToken,
    clearError,
  }
}
