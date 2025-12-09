<template>
  <div class="mx-auto mt-4 flex w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
    <WishlyButton variant="ghost" size="sm" href="/">
      <WishlyIcon name="material-symbols:arrow-back-rounded" size="20" class="text-gray-700" />
      <span class="ml-2 text-gray-700">Retour à l'accueil</span>
    </WishlyButton>
  </div>
  <div class="mx-auto flex h-[85vh] items-center justify-center px-4">
    <div class="flex w-full max-w-md flex-col justify-center gap-4">
      <h1 class="text-center text-3xl font-semibold text-gray-900">Inscription</h1>

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

        <WishlyInput
          v-model="confirmPassword"
          type="password"
          label="Confirmer le mot de passe :"
          placeholder="Entrez votre mot de passe"
          autocomplete="current-password"
          :error="confirmPasswordError"
          @blur="validateConfirmPassword"
        />

        <div class="text-sm text-gray-500">
          <a href="/login" class="flex justify-end font-medium text-purple-600 hover:text-purple-500">
            Déjà un compte ?
          </a>
        </div>
      </div>
      <WishlyButton
        class="mt-2"
        :disabled="!isFormValid"
        :loading="loading"
        @click="onRegister"
        :error="buttonError || emailError || passwordError || confirmPasswordError"
        variant="primary"
      >
        <p class="font-medium">S'inscrire</p>
        <WishlyIcon name="line-md:login" size="24" class="text-white" />
      </WishlyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import WishlyInput from '~/components/input/WishlyInput.vue'
import WishlyButton from '~/components/input/WishlyButton.vue'
import { computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'

const { register, clearError } = useAuth()
const { success, error: errorToast } = useToast()

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const confirmPassword: Ref<string> = ref('')
const buttonError: Ref<string | null> = ref(null)
const emailError: Ref<string | null> = ref(null)
const passwordError: Ref<string | null> = ref(null)
const confirmPasswordError: Ref<string | null> = ref(null)

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

/**
 * Validate confirm password format
 * @return {void}
 */
const validateConfirmPassword: () => void = () => {
  confirmPasswordError.value = passwordRegex.test(confirmPassword.value)
    ? null
    : 'Le mot de passe doit contenir au moins 8 caractères avec au moins une lettre et un chiffre.'
}

const isFormValid: ComputedRef<boolean> = computed(() => {
  const okEmail: boolean = emailRegex.test(email.value)
  const okPass: boolean = passwordRegex.test(password.value)
  const okConfirmPass: boolean = passwordRegex.test(confirmPassword.value)

  return okEmail && okPass && okConfirmPass
})

/**
 * Handle register action
 * @return {Promise<void>}
 */
const onRegister: () => Promise<void> = async (): Promise<void> => {
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  if (confirmPassword.value !== password.value) {
    buttonError.value = 'Les mots de passe ne correspondent pas.'
    return
  } else {
    buttonError.value = null
  }

  if (!isFormValid.value) return

  try {
    loading.value = true
    clearError()
    const result: any = await register(email.value, password.value)

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

  onMounted(() => {
    clearError()
  })
}
</script>
