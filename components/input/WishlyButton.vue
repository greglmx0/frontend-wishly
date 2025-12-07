<template>
  <div
    :is="isLink ? NuxtLink : 'button'"
    :to="href || undefined"
    :type="isLink ? undefined : type"
    :disabled="disabled || loading"
    :class="[baseClasses, sizeClasses, variantClasses, blockClasses, iconOnlyClasses]"
    @click="onClick"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      <span class="sr-only">Loading</span>
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { NuxtLink } from '#components'
// import WishlyIcon from '../WishlyIcon.vue'

/**
 * Variant type for button styles.
 * @typedef {'primary' | 'secondary' | 'ghost' | 'danger'} Variant
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

/**
 * Size type for button dimensions.
 * @typedef {'sm' | 'md' | 'lg'} Size
 */
type Size = 'sm' | 'md' | 'lg'

/**
 * ButtonType type for button HTML types.
 * @typedef {'button' | 'submit' | 'reset'} ButtonType
 */
type ButtonType = 'button' | 'submit' | 'reset'

/**
 * Props interface for BaseButton component.
 * @interface Props
 * @property {Variant} variant - The variant style of the button.
 * @property {Size} size - The size of the button.
 * @property {ButtonType} type - The HTML type of the button.
 * @property {string | null} href - The URL for link buttons.
 * @property {boolean} disabled - Whether the button is disabled.
 * @property {boolean} loading - Whether the button is in a loading state.
 * @property {boolean} block - Whether the button should take full width.
 * @property {boolean} iconOnly - Whether the button contains only an icon.
 */
type Props = {
  variant: Variant
  size: Size
  type: ButtonType
  href: string | null
  disabled: boolean
  loading: boolean
  block: boolean
  iconOnly: boolean
}

const props: Props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: ButtonType
    href?: string | null
    disabled?: boolean
    loading?: boolean
    block?: boolean
    iconOnly?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    href: null,
    disabled: false,
    loading: false,
    block: false,
    iconOnly: false,
  },
)

const emit: (e: 'click', ev: MouseEvent) => void = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const baseClasses: string =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const sizeClasses: ComputedRef<string> = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm px-3 py-2 gap-2'
    case 'lg':
      return 'text-base px-5 py-3 gap-3'
    default:
      return 'text-sm px-4 py-2.5 gap-2'
  }
})

const variantClasses: ComputedRef<string> = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300'
    case 'ghost':
      return 'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400'
    case 'primary':
      return 'inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl'
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-400'
  }
})

const blockClasses: ComputedRef<string> = computed(() => (props.block ? 'w-full' : 'w-auto'))

const iconOnlyClasses: ComputedRef<string> = computed(() => (props.iconOnly ? 'p-2 !px-2 !py-2' : ''))

const isLink: ComputedRef<boolean> = computed(() => !!props.href)

/**
 * Handle click event
 * @param ev - MouseEvent
 */
const onClick: (ev: MouseEvent) => void = (ev: MouseEvent) => {
  if (props.disabled || props.loading) {
    ev.preventDefault()
    return
  }
  emit('click', ev)
}
</script>
