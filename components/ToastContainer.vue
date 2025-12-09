<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
    <transition-group name="toast" tag="div" class="flex flex-col gap-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'animate-in fade-in slide-in-from-right-4 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg duration-300',
          toastClasses(toast.type),
        ]"
      >
        <div class="flex items-center gap-2">
          <span :class="toastIconClass(toast.type)">
            {{ toastIcon(toast.type) }}
          </span>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts } = useToast()

/**
 * Get CSS classes for toast based on type
 * @param type - Type of the toast (success, error, warning, info)
 * @return {string} - CSS classes for the toast
 */
const toastClasses: (type: string) => string = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Get icon for toast based on type
 * @param type - Type of the toast (success, error, warning, info)
 * @return {string} - Icon character for the toast
 */
const toastIcon: (type: string) => string = (type: string) => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return '•'
  }
}

/**
 * Get icon color class for toast based on type
 * @param type - Type of the toast (success, error, warning, info)
 * @return {string} - Icon color class for the toast
 */
const toastIconClass: (type: string) => string = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-100'
    case 'error':
      return 'text-red-100'
    case 'warning':
      return 'text-yellow-100'
    case 'info':
      return 'text-blue-100'
    default:
      return 'text-gray-100'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
