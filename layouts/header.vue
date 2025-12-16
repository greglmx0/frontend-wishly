<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2">
          <NuxtLink to="/">
            <div class="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
              <WishlyIcon name="iconoir:gift" size="32" class="text-white" />
            </div>
          </NuxtLink>
          <span class="text-lg text-gray-900 sm:text-xl">Wishly</span>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <div v-if="isAuthenticated" class="flex flex-wrap items-center gap-2 sm:gap-4">
            <span class="hidden text-xs font-medium text-gray-700 sm:inline sm:text-sm">
              Bonjour, <span class="text-purple-600">{{ userEmail }}</span>
            </span>
            <div class="flex items-center gap-2">
              <WishlyButton variant="ghost" size="sm" @click="onLogout">
                <span class="hidden sm:inline">Déconnexion</span>
                <WishlyIcon name="material-symbols:logout-rounded" size="20" class="text-gray-700" />
              </WishlyButton>
            </div>
          </div>

          <!-- Unauthenticated state -->
          <div v-else class="flex flex-wrap items-center gap-2 sm:gap-3">
            <WishlyButton variant="ghost" size="sm" href="/login">
              <span class="hidden sm:inline">Se connecter</span>
              <WishlyIcon name="line-md:login" size="20" class="text-gray-700 sm:hidden" />
            </WishlyButton>
            <WishlyButton variant="primary" size="sm" href="/register">
              <span class="hidden sm:inline">Créer un compte</span>
              <WishlyIcon name="material-symbols:person-add-rounded" size="20" class="text-white sm:hidden" />
            </WishlyButton>
          </div>
        </div>
      </div>
    </div>
  </header>
  <slot />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import WishlyButton from '~/components/input/WishlyButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const { user, isAuthenticated, logout, initializeAuth } = useAuth()
const { success } = useToast()

const userEmail: ComputedRef<string> = computed(() => user.value?.email || '')

/**
 * Handle logout action
 * @return {void}
 */
const onLogout: () => void = () => {
  logout()
  success('Vous avez été déconnecté', 1500)
  navigateTo('/login')
}

onMounted(() => {
  initializeAuth()
})
</script>
