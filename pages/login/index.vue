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
          :error="emailError"
          @blur="validateEmail"
        />
        <WishlyInput
          v-model="password"
          type="password"
          label="Mot de passe :"
          placeholder="Entrez votre mot de passe"
          autocomplete="current-password"
          :error="passwordError"
          @blur="validatePassword"
        />

        <div class="text-sm text-gray-500">
          <a href="/register" class="flex justify-end font-medium text-purple-600 hover:text-purple-500">
            Pas encore de compte ?
          </a>
        </div>
      </div>
      <WishlyButton
        class="mt-2"
        :disabled="!isFormValid"
        @click="onLogin"
        :loading="loading"
        variant="primary"
        size="lg"
        type="submit"
      >
        <p class="font-medium">Se connecter</p>
        <WishlyIcon name="line-md:login" size="24" class="text-white" />
      </WishlyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import WishlyInput from '~/components/input/WishlyInput.vue'
import WishlyButton from '~/components/input/WishlyButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const { login, clearError } = useAuth()
const { success, error: errorToast } = useToast()

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const emailError: Ref<string | null> = ref(null)
const passwordError: Ref<string | null> = ref(null)

const loading: Ref<boolean> = ref(false)

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password policy: min 8, at least 1 letter and 1 digit
const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'`~<>,.?/]{8,}$/

/**
 * Validate email format
 * @return {void}
 */
const validateEmail: () => void = () => {
  emailError.value = emailRegex.test(email.value)
    ? null
    : 'Veuillez entrer une adresse e-mail valide (ex: matheo@example.com).'
}

/**
 * Validate password format
 * @return {void}
 */
const validatePassword: () => void = () => {
  passwordError.value = passwordRegex.test(password.value)
    ? null
    : 'Le mot de passe doit contenir au moins 8 caractères avec au moins une lettre et un chiffre.'
}

const isFormValid: ComputedRef<boolean> = computed(() => {
  // Re-check to keep button state in sync
  const okEmail: boolean = emailRegex.test(email.value)
  const okPass: boolean = passwordRegex.test(password.value)
  return okEmail && okPass && !emailError.value && !passwordError.value
})

/**
 * Handle login action
 * @return {void}
 */
const onLogin: () => Promise<void> = async (): Promise<void> => {
  validateEmail()
  validatePassword()
  if (!isFormValid.value) return

  try {
    loading.value = true
    clearError()
    const result: any = await login(email.value, password.value)

    if (result.success) {
      success('Connexion réussie! Redirection en cours...', 1500)
      setTimeout(() => {
        navigateTo('/')
      }, 1500)
    } else {
      errorToast(result.error || 'Erreur de connexion', 5000)
    }
  } catch (err: any) {
    errorToast(err.message || 'Erreur de connexion', 5000)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  clearError()
})
</script>
