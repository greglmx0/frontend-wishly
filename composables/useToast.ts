import { ref, readonly } from 'vue'
import type { Ref } from 'vue'

/**
 * Toast types
 * @typedef {'success' | 'error' | 'info' | 'warning'} ToastType
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Toast interface
 * @property id - Unique identifier for the toast
 * @property message - Message to display
 * @property type - Type of the toast (success, error, info, warning)
 * @property duration - Duration in milliseconds before auto-dismissal (optional)
 */
export type Toast = {
  id: string
  message: string
  type: ToastType
  duration: number
}

const toasts: Ref<Toast[]> = ref<Toast[]>([])

/**
 * useToast composable for managing toast notifications
 * @returns { toasts, addToast, removeToast, success, error, info, warning }
 */
export const useToast: () => {
  toasts: Readonly<Ref<Toast[]>>
  addToast: (message: string, type: ToastType, duration: number) => string
  removeToast: (id: string) => void
  success: (message: string, duration: number) => string
  error: (message: string, duration: number) => string
  info: (message: string, duration: number) => string
  warning: (message: string, duration: number) => string
} = (): {
  toasts: Readonly<Ref<Toast[]>>
  addToast: (message: string, type: ToastType, duration: number) => string
  removeToast: (id: string) => void
  success: (message: string, duration: number) => string
  error: (message: string, duration: number) => string
  info: (message: string, duration: number) => string
  warning: (message: string, duration: number) => string
} => {
  /**
   * Add a new toast
   * @param message
   * @param type
   * @param duration
   * @returns
   */
  const addToast: (message: string, type: ToastType, duration: number) => string = (
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
  ) => {
    const id: string = `toast-${Date.now()}-${Math.random()}`
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  /**
   * Remove a toast by its ID
   * @param id - ID of the toast to remove
   */
  const removeToast: (id: string) => void = (id: string) => {
    toasts.value = toasts.value.filter((t: Toast) => t.id !== id)
  }

  /**
   * Shortcut methods for different toast types
   * @param message
   * @param duration
   * @returns
   */
  const success: (message: string, duration: number) => string = (message: string, duration: number) =>
    addToast(message, 'success', duration)

  /**
   * Shortcut methods for different toast types
   * @param message
   * @param duration
   * @returns
   */
  const error: (message: string, duration: number) => string = (message: string, duration: number) =>
    addToast(message, 'error', duration)

  /**
   * Shortcut methods for different toast types
   * @param message
   * @param duration
   * @returns
   */
  const info: (message: string, duration: number) => string = (message: string, duration: number) =>
    addToast(message, 'info', duration)

  /**
   * Shortcut methods for different toast types
   * @param message
   * @param duration
   * @returns
   */
  const warning: (message: string, duration: number) => string = (message: string, duration: number) =>
    addToast(message, 'warning', duration)

  return {
    toasts: readonly(toasts) as Readonly<Ref<Toast[]>>,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}
