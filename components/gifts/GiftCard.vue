<template>
  <div
    ref="cardRef"
    class="group col-span-full flex w-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    :class="inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-1 flex-col gap-2">
        <h3 class="line-clamp-2 break-words text-base font-semibold text-gray-900 sm:text-lg">{{ gift.name }}</h3>
        <div class="ml-1 flex items-center gap-2">
          <span
            v-if="canManage"
            class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] sm:text-xs"
            :class="visibilityBadgeClass(gift.visibility)"
          >
            <WishlyIcon name="mdi:eye-outline" size="14" class="mr-1" />
            {{ visibilityLabel(gift.visibility) }}
          </span>
          <span
            class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 sm:text-xs"
          >
            {{ gift.price ?? '—' }}
            <WishlyIcon name="material-symbols:euro-rounded" size="14" class="ml-1" />
          </span>
          <span
            class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 sm:text-xs"
            v-if="gift.tags?.length"
          >
            <WishlyIcon name="mdi:tag-outline" size="14" class="mr-1" />
            {{ gift.tags.join(', ') }}
          </span>
        </div>
      </div>

      <WishlyButton
        v-if="canManage"
        variant="ghost"
        size="sm"
        class="opacity-80 transition group-hover:opacity-100"
        @click="emit('edit', gift)"
        aria-label="Modifier"
      >
        <WishlyIcon name="mdi:pencil-outline" size="18" />
      </WishlyButton>
    </div>

    <div
      v-if="previewUrl"
      class="mt-3 flex h-80 items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-96"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Aperçu du cadeau"
        @error="onImgError"
        @load="onImgLoad"
        loading="lazy"
        decoding="async"
        style="max-height: 584px; max-width: 584px"
        class="h-full w-full object-scale-down transition-transform group-hover:scale-105"
      />
    </div>

    <p class="my-4 line-clamp-3 text-sm text-gray-600" v-if="gift.description">{{ gift.description }}</p>

    <div class="flex items-center justify-between">
      <WishlyButton
        v-if="gift.url"
        variant="secondary"
        size="sm"
        :href="gift.url"
        target="_blank"
        rel="noopener"
        class="mt-2"
      >
        <WishlyIcon name="mdi:link-variant" size="14" class="mr-2" />
        Voir le produit
      </WishlyButton>
      <WishlyButton
        v-if="canManage"
        variant="danger"
        size="sm"
        @click="emit('delete', String(gift.id))"
        aria-label="Supprimer"
      >
        <WishlyIcon name="mdi:trash-can-outline" size="18" />
      </WishlyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import WishlyButton from '~/components/input/WishlyButton.vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import type { Gift, GiftVisibility } from '~/composables/useGifts'
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * Props type
 * @typedef {Object} Props
 * @property {Gift} gift - Gift data
 * @property {boolean} canManage - Whether the user can manage (edit/delete) the
 */
type Props = {
  gift: Gift
  canManage: boolean
}

const props: Props = defineProps({
  gift: {
    type: Object as () => Gift,
    required: true,
  },
  canManage: {
    type: Boolean,
    required: true,
  },
})

/**
 * Emit events
 * @typedef {Object} Emits
 * @property {(gift: Gift) => void} edit - Emit when edit is requested
 * @property {(id: string) => void} delete - Emit when delete is requested
 */
const emit: {
  (e: 'edit', gift: Gift): void
  (e: 'delete', id: string): void
} = defineEmits()

const hidePreview: Ref<boolean> = ref(false)
const previewUrl: ComputedRef<string | null> = computed<string | null>(() => {
  if (hidePreview.value) return null
  const first: string | undefined = props.gift.images && props.gift.images.length > 0 ? props.gift.images[0] : undefined
  return first || null
})

/**
 * Handle image load error
 */
const onImgError: () => void = () => {
  hidePreview.value = true
}

/**
 * Handle image load
 */
const onImgLoad: () => void = () => {
  // Image loaded successfully
}

// Scroll-in animation (simple intersection observer)
const cardRef: Ref<HTMLElement | null> = ref(null)
const inView: Ref<boolean> = ref(false)

let observer: IntersectionObserver | null = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          inView.value = true
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 },
  )
  if (cardRef.value) observer.observe(cardRef.value)
})

onBeforeUnmount(() => {
  if (observer && cardRef.value) observer.unobserve(cardRef.value)
  observer = null
})

/**
 * Get visibility label
 * @param v - Gift visibility
 * @returns {string} - Label for the visibility
 */
const visibilityLabel: (v: GiftVisibility) => string = (v: GiftVisibility) => {
  switch (v) {
    case 'PUBLIC':
      return 'Publique'
    case 'PRIVATE':
      return 'Privée'
    case 'DISABLED':
      return 'Désactivé'
    default:
      return String(v)
  }
}

/**
 * Get visibility badge class
 * @param v - Gift visibility
 * @returns {string} - CSS classes for the visibility badge
 */
const visibilityBadgeClass: (v: GiftVisibility) => string = (v: GiftVisibility) => {
  switch (v) {
    case 'PUBLIC':
      return 'bg-green-100 text-green-700'
    case 'PRIVATE':
      return 'bg-gray-100 text-gray-700'
    case 'DISABLED':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
</script>

<style scoped>
.translate-y-4 {
  transform: translateY(1rem);
}
</style>
