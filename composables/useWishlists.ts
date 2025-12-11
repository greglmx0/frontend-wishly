import { ref, readonly } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

/** Wishlist type definition
 * @property id - Unique identifier for the wishlist
 * @property name - Name of the wishlist
 * @property description - Description of the wishlist (optional)
 * @property createdAt - Creation timestamp (optional)
 * @property updatedAt - Last update timestamp (optional)
 */
type Wishlist = {
  id: string
  name: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'
  createdAt?: string
  updatedAt?: string
}
/**
 * Wishlist input type for create and update operations
 * @property name - Name of the wishlist
 * @property description - Description of the wishlist (optional)
 */
type WishlistInput = {
  name: string
  description?: string
}

/**
 * useWishlists composable for managing wishlists
 * @returns { items, current, loading, error, list, get, create, update, remove }
 */
export const useWishlists: () => {
  items: Readonly<Ref<Wishlist[] | undefined>>
  current: Readonly<Ref<Wishlist | undefined>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | undefined>>
  list: () => Promise<{ success: boolean; data?: Wishlist[]; error?: string }>
  create: (payload: WishlistInput) => Promise<{ success: boolean; data?: Wishlist; error?: string }>
  update: (
    id: string,
    payload: Partial<WishlistInput>,
  ) => Promise<{ success: boolean; data?: Wishlist; error?: string }>
  remove: (id: string) => Promise<{ success: boolean; error?: string }>
} = () => {
  const items: Ref<Wishlist[] | undefined> = ref<Wishlist[] | undefined>(undefined)
  const current: Ref<Wishlist | undefined> = ref<Wishlist | undefined>(undefined)
  const loading: Ref<boolean> = ref<boolean>(false)
  const error: Ref<string | undefined> = ref<string | undefined>(undefined)

  const { getToken } = useAuth()

  /**
   *
   */
  const authHeaders: () => Record<string, string> | undefined = () => {
    const token: string | undefined = getToken() || undefined
    return token ? { Authorization: `Bearer ${token}` } : undefined
  }

  /**
   * Fetch all wishlists
   * @returns
   */
  const list: () => Promise<{ success: boolean; data?: Wishlist[]; error?: string }> = async () => {
    loading.value = true
    error.value = undefined
    try {
      const data: Wishlist[] = await $fetch<Wishlist[]>('/api/wishlists', {
        method: 'GET',
        headers: { ...authHeaders() },
      })
      items.value = data
      return { success: true, data }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to load wishlists'
      if (err?.status === 401 || err?.status === 403) {
        navigateTo({ path: '/login', query: { redirect: '/wishlists' } })
      }
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get a single wishlist by ID
   * @param payload - Wishlist ID
   * @returns
   */
  const create: (payload: WishlistInput) => Promise<{ success: boolean; data?: Wishlist; error?: string }> = async (
    payload: WishlistInput,
  ) => {
    loading.value = true
    error.value = undefined
    try {
      const data: Wishlist = await $fetch<Wishlist>('/api/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: payload,
      })
      // optimistic update
      items.value = items.value ? [data, ...items.value] : [data]
      return { success: true, data }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to create wishlist'
      if (err?.status === 401 || err?.status === 403) {
        navigateTo({ path: '/login', query: { redirect: '/wishlists' } })
      }
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update a wishlist by ID
   * @param id
   * @param payload
   * @returns
   */
  const update: (
    id: string,
    payload: Partial<WishlistInput>,
  ) => Promise<{ success: boolean; data?: Wishlist; error?: string }> = async (
    id: string,
    payload: Partial<WishlistInput>,
  ) => {
    loading.value = true
    error.value = undefined
    try {
      const data: Wishlist = await $fetch<Wishlist>(`/api/wishlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: payload,
      })
      // optimistic update
      if (items.value) {
        items.value = items.value.map((w: Wishlist) => (w.id === id ? data : w))
      }
      current.value = data
      return { success: true, data }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to update wishlist'
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove a wishlist by ID
   * @param id
   * @returns
   */
  const remove: (id: string) => Promise<{ success: boolean; error?: string }> = async (id: string) => {
    loading.value = true
    error.value = undefined
    try {
      await $fetch(`/api/wishlists/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
      })
      // optimistic update
      if (items.value) {
        items.value = items.value.filter((w: Wishlist) => w.id !== id)
      }
      if (current.value?.id === id) current.value = undefined
      return { success: true }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to delete wishlist'
      if (err?.status === 401 || err?.status === 403) {
        navigateTo({ path: '/login', query: { redirect: `/wishlists/${id}` } })
      }
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  return {
    items: readonly(items) as Readonly<Ref<Wishlist[] | undefined>>,
    current: readonly(current) as Readonly<Ref<Wishlist | undefined>>,
    loading: readonly(loading),
    error: readonly(error),
    list,
    create,
    update,
    remove,
  }
}
