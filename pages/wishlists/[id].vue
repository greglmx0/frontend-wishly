<template>
  <div class="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-center">
      <NuxtLink v-if="canManage" to="/wishlists" class="text-sm text-gray-600 hover:underline"
        >← Retour à mes Wishlists</NuxtLink
      >
    </div>

    <div class="mt-6">
      <!-- Error state -->
      <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <WishlyIcon name="mdi:alert-circle-outline" size="18" class="mr-2" />
            <span>{{ error }}</span>
          </div>
          <WishlyButton variant="secondary" size="sm" @click="list(wishlistId)">
            <WishlyIcon name="mdi:reload" size="16" class="mr-1" />
            Réessayer
          </WishlyButton>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-16">
        <span class="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
        <span class="ml-3 text-sm text-gray-600">Chargement des cadeaux...</span>
      </div>

      <div v-else-if="items && items.length === 0" class="flex h-[50vh] flex-col items-center justify-center gap-4">
        <WishlyIcon name="iconoir:gift" size="36" class="text-gray-400" />
        <p class="text-gray-600">Aucun cadeau pour cette wishlist.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="g in items"
          :key="g.id"
          class="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <h3 class="line-clamp-2 break-words text-base font-semibold text-gray-900 sm:text-lg">{{ g.name }}</h3>
              <div class="mt-1 flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 sm:text-xs"
                >
                  <WishlyIcon name="mdi:currency-usd" size="14" class="mr-1" />
                  {{ g.price ?? '—' }}
                </span>
                <span
                  class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 sm:text-xs"
                  v-if="g.tags?.length"
                >
                  <WishlyIcon name="mdi:tag-outline" size="14" class="mr-1" />
                  {{ g.tags.join(', ') }}
                </span>
              </div>
            </div>
            <WishlyButton
              variant="ghost"
              size="sm"
              class="opacity-80 transition group-hover:opacity-100"
              @click="openEdit(g)"
              aria-label="Modifier"
              v-if="canManage"
            >
              <WishlyIcon name="mdi:pencil-outline" size="18" />
            </WishlyButton>
          </div>

          <div class="mt-2">
            <p class="line-clamp-3 text-sm text-gray-600" v-if="g.description">{{ g.description }}</p>
            <a
              v-if="g.url"
              :href="g.url"
              target="_blank"
              rel="noopener"
              class="mt-2 inline-flex items-center text-xs text-purple-600 hover:underline"
            >
              <WishlyIcon name="mdi:link-variant" size="14" class="mr-1" />
              {{ g.url }}
            </a>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] sm:text-xs"
              :class="visibilityBadgeClass(g.visibility)"
            >
              <WishlyIcon name="mdi:eye-outline" size="14" class="mr-1" />
              {{ visibilityLabel(g.visibility) }}
            </span>
            <WishlyButton
              v-if="canManage"
              variant="danger"
              size="sm"
              @click="openConfirmDelete(g.id)"
              aria-label="Supprimer"
            >
              <WishlyIcon name="mdi:trash-can-outline" size="18" />
            </WishlyButton>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating Create Gift Button -->
  <div v-if="canManage" class="fixed bottom-8 right-8 z-40 md:bottom-20 md:right-80">
    <WishlyButton variant="primary" size="lg" @click="openCreate()" aria-label="Ajouter un cadeau">
      <WishlyIcon name="material-symbols:add-rounded" class="text-white" />
      <span class="ml-2 hidden md:inline">Ajouter un cadeau</span>
    </WishlyButton>
  </div>

  <!-- Create/Update Modal -->
  <Modal :open="modalOpen" :title="modalTitle" :closeOnBackdrop="true" @close="closeModal">
    <GiftForm ref="formRef" :initialValues="formData" @submit="onSubmitForm" />
    <template #footer>
      <div class="ml-auto flex items-center gap-2">
        <WishlyButton variant="ghost" size="sm" @click="closeModal">Annuler</WishlyButton>
        <WishlyButton variant="primary" size="sm" :loading="submitting" @click="triggerFormSubmit"
          >Valider</WishlyButton
        >
      </div>
    </template>
  </Modal>

  <!-- Confirm Delete Modal -->
  <Modal :open="confirmOpen" :title="confirmTitle" :closeOnBackdrop="true" @close="closeConfirm">
    <p class="text-sm text-gray-700">{{ confirmMessage }}</p>
    <template #footer>
      <div class="ml-auto flex items-center gap-2">
        <WishlyButton variant="ghost" size="sm" @click="closeConfirm">Annuler</WishlyButton>
        <WishlyButton variant="danger" size="sm" @click="confirmDelete">Supprimer</WishlyButton>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from '#app'
import { useGifts } from '~/composables/useGifts'
import type { Gift, GiftVisibility } from '~/composables/useGifts'
import { useToast } from '~/composables/useToast'
import { useWishlists } from '~/composables/useWishlists'
import WishlyButton from '~/components/input/WishlyButton.vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import Modal from '~/components/Modal.vue'
import GiftForm from '~/components/gifts/GiftForm.vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

definePageMeta({
  layout: 'header',
})

const route: RouteLocationNormalizedLoadedGeneric = useRoute()

const wishlistId: string = String(route.params.id)

const { items, loading, error, list, create, update, remove } = useGifts()
const { checkOwner } = useWishlists()
const { success, error: errorToast } = useToast()

const canManage: Ref<boolean> = ref<boolean>(false)

onMounted(() => {
  document.title = 'Cadeaux - Wishly'
  list(wishlistId)
  checkOwnership()
})

/**
 * Check if the current user owns the wishlist to enable manage actions
 * Assumes an existing route `/api/wishlists/:id` returning `{ id, ownerId }`
 * @return {Promise<void>}
 */
const checkOwnership: () => Promise<void> = async () => {
  const res: { success: boolean; data?: boolean; error?: string } = await checkOwner(wishlistId)
  canManage.value = !!res.success && !!res.data
}

/**
 * Gift form state
 * @typedef {Object} GiftFormData
 * @property {string} name - Name of the gift
 * @property {string} description - Description of the gift
 * @property {number|null} price - Price of the gift
 * @property {string[]} images - Array of image URLs
 * @property {string[]} tags - Array of tags
 * @property {string|null} url - URL of the gift
 * @property {GiftVisibility} visibility - Visibility of the gift
 */
type GiftFormData = {
  name: string
  description: string
  price: number | null
  images: string[]
  tags: string[]
  url: string | null
  visibility: GiftVisibility
}

const modalOpen: Ref<boolean> = ref(false)
const modalTitle: Ref<string> = ref('Ajouter un cadeau')
const submitting: Ref<boolean> = ref(false)
const formData: Ref<GiftFormData> = ref({
  name: '',
  description: '',
  price: null,
  images: [],
  tags: [],
  url: null,
  visibility: 'PUBLIC',
})
const editingId: Ref<string | null> = ref(null)
const formRef: Ref<InstanceType<typeof GiftForm> | null> = ref(null)

/**
 * Open create gift modal
 * @return {void}
 */
const openCreate: () => void = () => {
  modalTitle.value = 'Ajouter un cadeau'
  formData.value = { name: '', description: '', price: null, images: [], tags: [], url: null, visibility: 'PRIVATE' }
  editingId.value = null
  modalOpen.value = true
}

/**
 * Open edit gift modal
 * @param {Gift} g - Gift to edit
 * @return {void}
 */
const openEdit: (g: Gift) => void = (g: Gift) => {
  modalTitle.value = 'Modifier le cadeau'
  formData.value = {
    name: g.name || '',
    description: g.description || '',
    price: g.price ?? null,
    images: g.images,
    tags: g.tags,
    url: g.url ?? null,
    visibility: g.visibility,
  }
  editingId.value = String(g.id)
  modalOpen.value = true
}

/**
 * Close gift modal
 * @return {void}
 */
const closeModal: () => void = () => {
  modalOpen.value = false
}

/**
 * Handle form submit
 * @param payload - Gift form data
 */
const onSubmitForm: (payload: GiftFormData) => void = (payload: GiftFormData) => {
  formData.value = payload
}

/**
 * Trigger form submission
 * @return {Promise<void>}
 */
const triggerFormSubmit: () => Promise<void> = async () => {
  formRef.value?.submit?.()

  const nameVal: string = formData.value.name.trim()
  const visVal: string = formData.value.visibility.toString().trim()
  if (!nameVal || !visVal) return

  submitting.value = true
  try {
    if (editingId.value) {
      const res: { success: boolean; data?: Gift; error?: string } = await update(editingId.value, {
        name: nameVal,
        description: formData.value.description,
        price: formData.value.price ?? null,
        images: formData.value.images,
        tags: formData.value.tags,
        url: formData.value.url,
        visibility: formData.value.visibility,
      })
      if (res.success) {
        success('Cadeau mis à jour', 3000)
        closeModal()
      } else if (res.error) {
        errorToast(res.error, 3000)
      }
    } else {
      const res: { success: boolean; data?: Gift; error?: string } = await create(wishlistId, {
        name: nameVal,
        description: formData.value.description,
        price: formData.value.price ?? null,
        images: formData.value.images,
        tags: formData.value.tags,
        url: formData.value.url,
        visibility: formData.value.visibility,
      })
      if (res.success) {
        success('Cadeau créé', 3000)
        closeModal()
        list(wishlistId)
      } else if (res.error) {
        errorToast(res.error, 3000)
      }
    }
  } finally {
    submitting.value = false
  }
}

// Confirm delete modal state
const confirmOpen: Ref<boolean> = ref(false)
const confirmId: Ref<string | null> = ref(null)
const confirmTitle: Ref<string> = ref('Supprimer le cadeau')
const confirmMessage: Ref<string> = ref('Êtes-vous sûr de vouloir supprimer ce cadeau ? Cette action est irréversible.')

/**
 * Open confirm delete modal
 * @param id - ID of the gift to delete
 */
const openConfirmDelete: (id: string) => void = (id: string) => {
  confirmId.value = id
  confirmOpen.value = true
}
/**
 * Close confirm delete modal
 * @return {void}
 */
const closeConfirm: () => void = () => {
  confirmOpen.value = false
  confirmId.value = null
}
/** Confirm delete action
 * @return {Promise<void>}
 */
const confirmDelete: () => Promise<void> = async (): Promise<void> => {
  if (!confirmId.value) return
  const result: { success: boolean; data?: Gift; error?: string } = await remove(confirmId.value)
  if (result.success) {
    success('Cadeau supprimé', 3000)
    closeConfirm()
  } else if (result.error) {
    errorToast(result.error, 3000)
  }
}

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

<style scoped></style>
