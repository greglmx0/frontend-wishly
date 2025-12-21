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
        <GiftCard
          v-for="g in items"
          :key="g.id"
          :gift="g"
          :can-manage="canManage"
          @edit="openEdit"
          @delete="openConfirmDelete"
        />
      </div>
    </div>
  </div>

  <!-- Floating Create Gift Button -->
  <div v-if="canManage" class="fixed bottom-8 right-8 z-40">
    <WishlyButton variant="primary" size="lg" @click="openCreate()">
      <WishlyIcon name="material-symbols:add-rounded" class="text-white" />
    </WishlyButton>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" :closeOnBackdrop="true" @close="closeModal">
    <GiftForm ref="formRef" :initialValues="formData" @submit="onSubmitForm" />
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
import type { Gift } from '~/composables/useGifts'
import { useToast } from '~/composables/useToast'
import { useWishlists } from '~/composables/useWishlists'
import WishlyButton from '~/components/input/WishlyButton.vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import Modal from '~/components/Modal.vue'
import GiftForm from '~/components/gifts/GiftForm.vue'
import GiftCard from '~/components/gifts/GiftCard.vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

definePageMeta({
  layout: 'header',
})

const route: RouteLocationNormalizedLoadedGeneric = useRoute()

const wishlistId: string = String(route.params.id)

// const { items, loading, error, list, create, update, remove } = useGifts()
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
 * Gift form data (must match GiftFormValues from GiftForm.vue)
 * Type for handling form submission and state
 */
type GiftFormData = Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>

const modalOpen: Ref<boolean> = ref(false)
const modalTitle: Ref<string> = ref('Ajouter un cadeau')
const formData: Ref<GiftFormData> = ref({
  name: '',
  description: '',
  price: undefined,
  images: [],
  tags: [],
  url: null,
  wishlistId: '',
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
  formData.value = {
    name: '',
    description: '',
    price: undefined,
    images: [],
    tags: [],
    url: null,
    wishlistId: '',
    visibility: 'PUBLIC',
  }
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
    name: g.name,
    description: g.description ?? '',
    price: g.price,
    images: g.images ?? [],
    tags: g.tags ?? [],
    url: g.url ?? null,
    wishlistId: g.wishlistId,
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
const onSubmitForm: (payload: GiftFormData) => Promise<void> = async (payload: GiftFormData): Promise<void> => {
  const nameVal: string = payload.name.trim()
  if (!nameVal) {
    errorToast('Le nom du cadeau est requis', 3000)
    return
  }

  try {
    if (editingId.value) {
      // Update existing gift
      const res: { success: boolean; data?: Gift; error?: string } = await update(editingId.value, {
        name: nameVal,
        description: payload.description,
        price: payload.price,
        images: payload.images,
        tags: payload.tags,
        url: payload.url,
        visibility: payload.visibility,
      })
      if (res.success) {
        success('Cadeau mis à jour avec succès', 3000)
        closeModal()
        await list(wishlistId)
      } else if (res.error) {
        errorToast(res.error, 3000)
      }
    } else {
      // Create new gift
      const res: { success: boolean; data?: Gift; error?: string } = await create(wishlistId, {
        name: nameVal,
        description: payload.description,
        price: payload.price,
        images: payload.images,
        tags: payload.tags,
        url: payload.url,
        visibility: payload.visibility,
      })
      if (res.success) {
        success('Cadeau créé avec succès', 3000)
        closeModal()
        await list(wishlistId)
      } else if (res.error) {
        errorToast(res.error, 3000)
      }
    }
  } catch {
    errorToast('Une erreur est survenue', 3000)
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
</script>

<style scoped></style>
