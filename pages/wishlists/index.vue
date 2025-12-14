<template>
  <div class="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <WishlyButton variant="primary" size="sm" @click="onCreate">
      <WishlyIcon name="material-symbols:add-rounded" size="20" class="text-white" />
      <span class="ml-1">Créer une liste</span>
    </WishlyButton>
  </div>

  <div class="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Loader -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <span class="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
      <span class="ml-3 text-sm text-gray-600">Chargement des wishlists...</span>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="items && items.length === 0"
      class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 py-16"
    >
      <WishlyIcon name="iconoir:gift" size="36" class="text-gray-400" />
      <p class="text-gray-600">Aucune wishlist pour le moment.</p>
      <WishlyButton variant="primary" size="sm" @click="onCreate">
        <WishlyIcon name="material-symbols:add-rounded" size="20" class="text-white" />
        <span class="ml-1">Créer une liste</span>
      </WishlyButton>
    </div>

    <!-- List -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="wl in items"
        :key="wl.id"
        class="flex flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm"
      >
        <div>
          <h3 class="truncate text-lg font-semibold text-gray-900">{{ wl.name }}</h3>
          <p class="mt-1 line-clamp-2 text-sm text-gray-600" v-if="wl.description">{{ wl.description }}</p>
          <p class="mt-2 text-xs text-gray-400" v-if="wl.createdAt">Créée le {{ formatDate(wl.createdAt) }}</p>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <WishlyButton variant="secondary" size="sm" :href="`/wishlists/${wl.id}`">
            <WishlyIcon name="mdi:eye-outline" size="18" />
            <span class="ml-1">Consulter</span>
          </WishlyButton>
          <WishlyButton variant="ghost" size="sm" :href="`/wishlists/${wl.id}/edit`">
            <WishlyIcon name="mdi:pencil-outline" size="18" />
            <span class="ml-1">Modifier</span>
          </WishlyButton>
          <WishlyButton variant="danger" size="sm" @click="onDelete(wl.id)">
            <WishlyIcon name="mdi:trash-can-outline" size="18" />
            <span class="ml-1">Supprimer</span>
          </WishlyButton>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWishlists } from '~/composables/useWishlists'
import { useToast } from '~/composables/useToast'
import WishlyButton from '~/components/input/WishlyButton.vue'
import WishlyIcon from '~/components/WishlyIcon.vue'

const { items, loading, error, list, create, remove } = useWishlists()
const { success, error: errorToast } = useToast()

onMounted(() => {
  document.title = 'Mes Wishlists - Wishly'
  list()
})

/**
 * Handle create new wishlist
 */
const onCreate: () => Promise<void> = async () => {
  const result: Awaited<ReturnType<typeof create>> = await create({ name: 'Nouvelle wishlist' })
  if (result.success && result.data) {
    success('Wishlist créée', 3000)
    navigateTo(`/wishlists/${result.data.id}/edit`)
  } else if (result.error) {
    errorToast(result.error, 3000)
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
