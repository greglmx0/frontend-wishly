<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
            <WishlyIcon name="iconoir:gift" size="32" class="text-white" />
          </div>
          <span class="text-xl text-gray-900">Wishly</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Authenticated state -->
          <div v-if="isAuthenticated" class="flex items-center gap-4">
            <span class="text-sm font-medium text-gray-700">
              Bonjour, <span class="text-purple-600">{{ userEmail }}</span>
            </span>
            <WishlyButton variant="ghost" size="sm" @click="onLogout">
              <span>Déconnexion</span>
            </WishlyButton>
          </div>

          <!-- Unauthenticated state -->
          <div v-else class="flex items-center gap-3">
            <WishlyButton variant="ghost" href="/login">
              <span>Se connecter</span>
            </WishlyButton>
            <WishlyButton variant="primary" href="/register">
              <span>Créer un compte</span>
            </WishlyButton>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import WishlyButton from './input/WishlyButton.vue'
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
