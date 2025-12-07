<template>
  <div class="mx-auto flex h-screen items-center justify-center px-4">
    <div class="flex w-full max-w-md flex-col justify-center gap-4">
      <h1 class="text-center text-3xl font-semibold text-gray-900">Connexion</h1>

      <div class="mt-4 flex flex-col justify-center gap-4">
        <WishlyInput
          v-model="email"
          type="email"
          label="Adresse e-mail :"
          placeholder="Entrez votre email"
          autocomplete="email"
        />
        <WishlyInput
          v-model="password"
          type="password"
          label="Mot de passe :"
          placeholder="Entrez votre mot de passe"
          autocomplete="current-password"
        />

        <div class="text-sm text-gray-500">
          <a href="/register" class="flex justify-end font-medium text-purple-600 hover:text-purple-500">
            Pas encore de compte ?
          </a>
        </div>
      </div>
      <WishlyButton class="mt-2" @click="onLogin">
        <p class="font-medium">Se connecter</p>
        <WishlyIcon name="line-md:login" size="24" class="text-white" />
      </WishlyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import WishlyInput from '~/components/WishlyInput.vue'
import WishlyButton from '~/components/input/WishlyButton.vue'

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')

/**
 * Handle login action
 * @return {void}
 */
const onLogin: () => void = () => {
  // Placeholder login handler
  // You can integrate your real auth logic here.
  console.log('Login with', { email: email.value, password: password.value })
}
</script>
