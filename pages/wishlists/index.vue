<template>
  <div class="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex items-center justify-center py-16">
      <span class="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
      <span class="ml-3 text-sm text-gray-600">Chargement des wishlists...</span>
    </div>

    <div
      v-else-if="items && items.length === 0"
      class="mx-auto flex h-[85vh] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 py-16"
    >
      <WishlyIcon name="iconoir:gift" size="36" class="text-gray-400" />
      <p class="text-gray-600">Aucune wishlist pour le moment.</p>
      <WishlyButton variant="primary" size="sm" @click="openCreate()">
        <WishlyIcon name="material-symbols:add-rounded" size="20" class="text-white" />
        <span class="ml-1 hidden sm:inline">Créer une liste</span>
      </WishlyButton>
    </div>

    <div v-else class="flex flex-col gap-6">
      <div class="mx-auto mt-4 flex w-full max-w-7xl -flex-row justify-between px-4 sm:px-6 lg:px-8">
        <WishlyButton variant="ghost" size="sm" href="/">
          <WishlyIcon name="material-symbols:arrow-back-rounded" size="20" class="text-gray-700" />
          <span class="ml-2 text-gray-700">Retour à l'accueil</span>
        </WishlyButton>

        <WishlyButton variant="primary" size="sm" @click="openCreate()" class="ml-auto justify-self-end">
          <WishlyIcon name="material-symbols:add-rounded" size="20" class="text-white" />
          <span class="ml-1">Créer une liste</span>
        </WishlyButton>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="wl in items"
          :key="wl.id"
          class="flex flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div>
            <div class="flex items-center justify-between">
              <h3 class="truncate text-lg font-semibold text-gray-900">{{ wl.name }}</h3>

              <WishlyButton variant="ghost" size="sm" @click="openEdit(wl)" aria-label="Modifier">
                <WishlyIcon name="mdi:pencil-outline" size="18" />
              </WishlyButton>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-gray-600" v-if="wl.description">{{ wl.description }}</p>
            <p class="mt-2 text-xs text-gray-400" v-if="wl.createdAt">Créée le {{ formatDate(wl.createdAt) }}</p>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <WishlyButton variant="secondary" size="lg" :href="`/wishlists/${wl.id}`">
              <WishlyIcon name="iconoir:gift" size="18" />
              <!-- <span class="ml-2">Consulter la liste</span> -->
            </WishlyButton>
            <span
              v-if="wl.countGifts !== undefined"
              class="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {{ wl.countGifts }} cadeaux
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" :closeOnBackdrop="true" @close="closeModal">
    <WishlistForm
      ref="formRef"
      :name="formData.name"
      :description="formData.description"
      :visibility="formData.visibility"
      @submit="onSubmitForm"
    />
    <template #footer>
      <div class="flex w-full items-center justify-between">
        <WishlyButton v-if="editingId" variant="danger" size="sm" :loading="submitting" @click="onDelete(editingId)">
          <WishlyIcon name="mdi:trash-can-outline" size="18" class="gap-4" />
        </WishlyButton>
        <div class="ml-auto flex items-center gap-2">
          <WishlyButton variant="ghost" size="sm" @click="closeModal">Annuler</WishlyButton>
          <WishlyButton variant="primary" size="sm" :loading="submitting" @click="triggerFormSubmit"
            >Valider</WishlyButton
          >
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useWishlists } from '~/composables/useWishlists'
import type { Wishlist } from '~/composables/useWishlists'
import { useToast } from '~/composables/useToast'
import WishlyButton from '~/components/input/WishlyButton.vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import Modal from '~/components/Modal.vue'
import WishlistForm from '~/components/wishlists/WishlistForm.vue'

const { items, loading, error, list, create, update, remove } = useWishlists()
const { success, error: errorToast } = useToast()

onMounted(() => {
  document.title = 'Mes Wishlists - Wishly'
  list()
})

/**
 * Wishlist form data type
 */
type WishlistFormData = {
  name: string
  description: string
  visibility: Wishlist['visibility']
}

const modalOpen: Ref<boolean> = ref(false)
const modalTitle: Ref<string> = ref('Créer une liste')
const submitting: Ref<boolean> = ref(false)
const formData: Ref<WishlistFormData> = ref({
  name: '',
  description: '',
  visibility: 'PUBLIC',
})
const editingId: Ref<string | null> = ref(null)
const formRef: Ref<InstanceType<typeof WishlistForm> | null> = ref(null)

/**
 * Open create wishlist modal
 */
const openCreate: () => void = () => {
  modalTitle.value = 'Créer une liste'
  formData.value = { name: '', description: '', visibility: 'PRIVATE' }
  editingId.value = null
  modalOpen.value = true
}

/**
 * Open edit wishlist modal
 * @param wl - Wishlist data
 */
const openEdit: (wl: any) => void = (wl: any) => {
  modalTitle.value = 'Modifier la liste'
  formData.value = {
    name: wl.name || '',
    description: wl.description || '',
    visibility: (wl.visibility as any) || 'PRIVATE',
  }
  editingId.value = wl.id
  modalOpen.value = true
}

/**
 * Close modal
 */
const closeModal: () => void = () => {
  modalOpen.value = false
}

/**
 * Handle form submission
 * @param payload - Form data
 */
const onSubmitForm: (payload: WishlistFormData) => void = (payload: WishlistFormData) => {
  formData.value = payload
}

/**
 * Trigger form submission
 */
const triggerFormSubmit: () => Promise<void> = async () => {
  // First, trigger child form validation & emit
  formRef.value?.submit?.()

  // Guard: prevent request if required fields are empty
  const nameVal: string = (formData.value.name || '').trim()
  const visVal: string = formData.value.visibility.toString().trim()
  if (!nameVal || !visVal) {
    return
  }

  submitting.value = true
  try {
    if (editingId.value) {
      const res: Awaited<ReturnType<typeof update>> = await update(editingId.value, {
        name: nameVal,
        description: formData.value.description,
        visibility: formData.value.visibility,
      })
      if (res.success) {
        success('Wishlist mise à jour', 3000)
        closeModal()
      } else if (res.error) {
        errorToast(res.error, 3000)
      }
    } else {
      const res: Awaited<ReturnType<typeof create>> = await create({
        name: nameVal,
        description: formData.value.description,
        visibility: formData.value.visibility,
      })
      if (res.success) {
        success('Wishlist créée', 3000)
        closeModal()
        list()
      } else if (res.error) {
        errorToast(res.error, 3000)
      }
    }
  } finally {
    submitting.value = false
  }
}

/**
 * Handle delete wishlist
 * @param id - Wishlist ID
 */
const onDelete: (id: string) => Promise<void> = async (id: string) => {
  if (!confirm('Supprimer cette wishlist ?')) return
  const result: Awaited<ReturnType<typeof remove>> = await remove(id)
  if (result.success) {
    success('Wishlist supprimée', 3000)
  } else if (result.error) {
    errorToast(result.error, 3000)
  }
}

/**
 * Format ISO date string to readable dates
 * @param iso - ISO date string
 */
const formatDate: (iso: string | undefined) => string = (iso: string | undefined) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return ''
  }
}
</script>
