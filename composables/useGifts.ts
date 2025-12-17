import { ref, readonly } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

/**
 * Gift visibility options
 * @property PUBLIC - Public visibility
 * @property DISABLED - Disabled visibility
 * @property PRIVATE - Private visibility
 */
export type GiftVisibility = 'PUBLIC' | 'DISABLED' | 'PRIVATE'

/** Gift type definition
 * @property id - Unique identifier for the gift
 * @property name - Name of the gift
 * @property description - Description of the gift
 * @property price - Price of the gift (optional)
 * @property images - Array of image URLs
 * @property tags - Array of tags
 * @property url - URL to the gift (optional)
 * @property wishlistId - ID of the associated wishlist
 * @property visibility - Visibility of the gift
 * @property createdAt - Creation timestamp (optional)
 * @property updatedAt - Last update timestamp (optional)
 */
export type Gift = {
  id: string
  name: string
  description: string
  price: number | null
  images: string[]
  tags: string[]
  url: string | null
  wishlistId: string
  visibility: GiftVisibility
  createdAt?: string
  updatedAt?: string
}

/**
 * Gift input type for create and update operations
 * @property name - Name of the gift
 * @property description - Description of the gift (optional)
 * @property price - Price of the gift (optional)
 * @property images - Array of image URLs (optional)
 * @property tags - Array of tags (optional)
 * @property url - URL to the gift (optional)
 * @property visibility - Visibility of the gift (optional)
 */
export type CreateGiftInput = {
  name: string
  description?: string
  price?: number | null
  images?: string[]
  tags?: string[]
  url?: string | null
  visibility?: GiftVisibility
}

/**
 * Gift input type for update operations
 */
export type UpdateGiftInput = Partial<CreateGiftInput>

/**
 *
 */
export const useGifts: () => {
  items: Readonly<Ref<Gift[] | undefined>>
  current: Readonly<Ref<Gift | undefined>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | undefined>>
  list: (wishlistId: string) => Promise<{ success: boolean; data?: Gift[]; error?: string }>
  create: (wishlistId: string, payload: CreateGiftInput) => Promise<{ success: boolean; data?: Gift; error?: string }>
  update: (giftId: string, payload: UpdateGiftInput) => Promise<{ success: boolean; data?: Gift; error?: string }>
  remove: (giftId: string) => Promise<{ success: boolean; error?: string }>
} = () => {
  const items: Ref<Gift[] | undefined> = ref<Gift[] | undefined>(undefined)
  const current: Ref<Gift | undefined> = ref<Gift | undefined>(undefined)
  const loading: Ref<boolean> = ref<boolean>(false)
  const error: Ref<string | undefined> = ref<string | undefined>(undefined)

  const { getToken, logout } = useAuth()

  /**
   *
   */
  const authHeaders: () => Record<string, string> | undefined = () => {
    const token: string | undefined = getToken() || undefined
    return token ? { Authorization: `Bearer ${token}` } : undefined
  }

  /**
   * List gifts for a specific wishlist
   * @param wishlistId - ID of the wishlist
   * @returns Promise resolving to success status, array of gifts, and optional error message
   */
  const list: (wishlistId: string) => Promise<{ success: boolean; data?: Gift[]; error?: string }> = async (
    wishlistId: string,
  ) => {
    loading.value = true
    error.value = undefined
    try {
      const data: Gift[] = await $fetch<Gift[]>(`/api/wishlist/${wishlistId}/gifts`, {
        method: 'GET',
        headers: { ...authHeaders() },
      })
      items.value = data
      return { success: true, data }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to load gifts'
      if (err?.status === 401 || err?.status === 403) {
        logout()
        navigateTo({ path: '/login', query: { redirect: `/wishlists/${wishlistId}` } })
      }
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new gift
   * @param wishlistId - ID of the wishlist to add the gift to
   * @param payload - CreateGiftInput payload
   * @returns Promise resolving to success status, created gift data, and optional error message
   */
  const create: (
    wishlistId: string,
    payload: CreateGiftInput,
  ) => Promise<{ success: boolean; data?: Gift; error?: string }> = async (
    wishlistId: string,
    payload: CreateGiftInput,
  ) => {
    loading.value = true
    error.value = undefined
    try {
      const data: Gift = await $fetch<Gift>(`/api/wishlist/${wishlistId}/gifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: payload,
      })
      items.value = items.value ? [data, ...items.value] : [data]
      return { success: true, data }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to create gift'
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update a gift by ID
   * @param giftId - ID of the gift to update
   * @param payload - UpdateGiftInput payload
   * @returns Promise resolving to success status, updated gift data, and optional error message
   */
  const update: (
    giftId: string,
    payload: UpdateGiftInput,
  ) => Promise<{ success: boolean; data?: Gift; error?: string }> = async (
    giftId: string,
    payload: UpdateGiftInput,
  ) => {
    loading.value = true
    error.value = undefined
    try {
      const data: Gift = await $fetch<Gift>(`/api/gifts/${giftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: payload,
      })
      if (items.value) {
        items.value = items.value.map((g: Gift) => (String(g.id) === String(giftId) ? data : g))
      }
      current.value = data
      return { success: true, data }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to update gift'
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a gift by ID
   * @param giftId - ID of the gift to delete
   * @returns Promise resolving to success status and optional error message
   */
  const remove: (giftId: string) => Promise<{ success: boolean; error?: string }> = async (giftId: string) => {
    loading.value = true
    error.value = undefined
    try {
      await $fetch(`/api/gifts/${giftId}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
      })
      if (items.value) {
        items.value = items.value.filter((g: Gift) => String(g.id) !== String(giftId))
      }
      if (current.value && String(current.value.id) === String(giftId)) current.value = undefined
      return { success: true }
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to delete gift'
      return { success: false, error: error.value || undefined }
    } finally {
      loading.value = false
    }
  }

  return {
    items: readonly(items) as Readonly<Ref<Gift[] | undefined>>,
    current: readonly(current) as Readonly<Ref<Gift | undefined>>,
    loading: readonly(loading),
    error: readonly(error),
    list,
    create,
    update,
    remove,
  }
}
