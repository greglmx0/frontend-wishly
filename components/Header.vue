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
          <button class="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:text-gray-900 hover:shadow-md">
            Se connecter
          </button>
          <button
            class="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-white shadow-sm transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-md"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import WishlyIcon from '~/components/WishlyIcon.vue'
</script>
