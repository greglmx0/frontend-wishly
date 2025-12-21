<template>
  <div class="flex flex-col gap-6">
    <!-- Step 1: URL Input -->
    <template v-if="currentStep === 1">
      <div class="space-y-4">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Rechercher un produit</h2>
          <p class="mt-1 text-sm text-gray-600">Collez l'URL du produit pour commencer</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">URL du produit</label>
          <WishlyInput
            v-model="scrapingUrl"
            type="text"
            placeholder="https://exemple.com/produit"
            :error="urlError"
            :disabled="scraper.loading.value"
          />
        </div>

        <div class="flex justify-center gap-3 pt-4">
          <WishlyButton
            :disabled="!scrapingUrl || scraper.loading.value"
            :loading="scraper.loading.value"
            @click="handleScrapeUrl"
          >
            {{ scraper.loading.value ? 'Recherche en cours...' : 'Rechercher' }}
          </WishlyButton>
          <WishlyButton variant="ghost" @click="currentStep = 2"> Remplir manuellement </WishlyButton>
        </div>

        <div v-if="scraper.error.value" class="rounded-md bg-red-50 p-3">
          <p class="text-sm text-red-700">{{ scraper.error.value }}</p>
        </div>
      </div>
    </template>

    <template v-else-if="currentStep === 2">
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">Modifier les informations</h2>
        <p class="mt-1 text-sm text-gray-600">Ajustez les détails du produit</p>

        <form class="flex flex-col gap-4" @submit.prevent="">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <WishlyInput
              v-model="local.name"
              type="text"
              placeholder="Ex: Lego Millennium Falcon"
              :error="errors.name"
              :maxlength="200"
              required
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <WishlyTextarea
              v-model="local.description"
              :rows="3"
              placeholder="Optionnel"
              :error="errors.description"
              :maxlength="2000"
            />
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Prix</label>
              <WishlyInput v-model="priceInput" type="text" placeholder="Ex: 129.99" :error="errors.price" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Visibilité</label>
              <WishlySelect v-model="local.visibility" :error="errors.visibility" required>
                <option value="PUBLIC">Publique</option>
                <option value="PRIVATE">Privée</option>
                <option value="DISABLED">Désactivé</option>
              </WishlySelect>
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
            <WishlyInput v-model="tagsInput" type="text" placeholder="Ex: jouet, star wars" />
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <div
              v-for="(img, index) in local.images"
              :key="index"
              class="group relative flex h-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              <img :src="img" class="max-h-full max-w-full object-contain transition-transform group-hover:scale-105" />
              <button
                type="button"
                class="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-red-500 hover:shadow-lg"
                @click="removeImage(index)"
              >
                <WishlyIcon name="iwwa:delete" size="18" class="text-red-600 transition-colors hover:text-white" />
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Ajouter une image</label>
            <div class="flex gap-2">
              <WishlyInput
                v-model="newImageInput"
                placeholder="https://exemple.com/image.jpg"
                :error="newImageError"
                @keyup.enter="addImages"
              />
              <WishlyButton @click="addImages" :disabled="!newImageInput.trim()"> Ajouter </WishlyButton>
            </div>
            <p class="mt-1 text-xs text-gray-500">Formats supportés: JPG, PNG, GIF, WebP, SVG</p>
          </div>
        </form>

        <div class="flex justify-center gap-3 pt-4">
          <WishlyButton variant="secondary" @click="currentStep = 1"> Annuler </WishlyButton>
          <WishlyButton @click="goToPreview"> Aperçu </WishlyButton>
        </div>
      </div>
    </template>

    <!-- Step 3: Preview -->
    <template v-else-if="currentStep === 3">
      <div class="space-y-6">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Aperçu du cadeau</h2>
            <p class="mt-1 text-sm text-gray-600">Vérifiez les informations avant de confirmer</p>
          </div>
        </div>

        <GiftCard :gift="local" :can-manage="false" />
        <div class="flex justify-center gap-3 pt-4">
          <WishlyButton variant="secondary" @click="currentStep = 2"> ← Modifier </WishlyButton>
          <WishlyButton @click="onSubmit"> Confirmer & Ajouter </WishlyButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'
import WishlyInput from '~/components/input/WishlyInput.vue'
import WishlyTextarea from '~/components/input/WishlyTextarea.vue'
import WishlySelect from '~/components/input/WishlySelect.vue'
import WishlyButton from '~/components/input/WishlyButton.vue'
import type { GiftVisibility } from '~/composables/useGifts'
import GiftCard from './GiftCard.vue'
import { useUrlScraper } from '~/composables/useUrlScraper'

/**
 * Gift form values (excludes server metadata)
 * Type for form submission and state management
 */
type GiftFormValues = Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Form validation errors
 */
type FormErrors = {
  name: string
  description: string
  price: string
  visibility?: string
}

/**
 * Form step type
 */
type FormStep = 1 | 2 | 3

const DEFAULT_FORM_VALUES: GiftFormValues = {
  name: '',
  description: '',
  price: undefined,
  images: [],
  tags: [],
  url: null,
  wishlistId: '',
  visibility: 'PRIVATE' as GiftVisibility,
}

const FIELD_CONSTRAINTS: { NAME_MAX: number; DESCRIPTION_MAX: number } = {
  NAME_MAX: 200,
  DESCRIPTION_MAX: 2000,
}

const props: { initialValues?: Partial<GiftFormValues> } = defineProps<{
  /**
   * Initial values to pre-fill the form (for editing)
   */
  initialValues?: Partial<GiftFormValues>
}>()

const emit: (e: 'submit', payload: GiftFormValues) => void = defineEmits<{
  /**
   * Emitted when form is submitted successfully
   */
  (e: 'submit', payload: GiftFormValues): void
}>()

const currentStep: Ref<FormStep> = ref<FormStep>(1)
const scrapingUrl: Ref<string> = ref('')
const urlError: Ref<string> = ref('')
const scraper: UseUrlScraperReturn = useUrlScraper()
const newImageInput: Ref<string> = ref('')
const newImageError: Ref<string> = ref('')
const addingImageLoading: Ref<boolean> = ref(false)

const local: GiftFormValues = reactive<GiftFormValues>({
  ...DEFAULT_FORM_VALUES,
  ...props.initialValues,
})

const errors: FormErrors = reactive<FormErrors>({
  name: '',
  description: '',
  price: '',
})
/**
 * Convert tags array to comma-separated string and vice versa
 */
const tagsInput: ComputedRef<string> = computed<string>({
  /**
   * Convert tags array to comma-separated string and vice versa
   */
  get: () => (local.tags ?? []).join(', '),
  /**
   * Convert comma-separated string to tags array
   * @param val - Comma-separated tags string
   */
  set: (val: string) => {
    local.tags = val
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)
  },
})

/**
 * Remove image at specified index
 * @param index - Index of image to remove
 */
const removeImage: (index: number) => void = (index: number): void => {
  if (local.images && index >= 0 && index < local.images.length) {
    local.images.splice(index, 1)
  }
}

/**
 * Add images from newImageInput to images array (validated via backend)
 */
const addImages: () => Promise<void> = async (): Promise<void> => {
  newImageError.value = ''
  const raw: string = newImageInput.value
  const inputs: string[] = raw
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)

  if (inputs.length === 0) {
    newImageError.value = 'Veuillez entrer une URL'
    return
  }

  addingImageLoading.value = true
  try {
    const validatedUrls: string[] = []

    for (const val of inputs) {
      // Basic format check
      try {
        const u: URL = new URL(val)
        if (!u.protocol.startsWith('http')) {
          throw new Error("L'URL doit commencer par http:// ou https://")
        }
      } catch {
        throw new Error(`Format d'URL invalide: ${val}`)
      }

      // Backend validation of content-type
      const res: { valid: boolean; url: string } = await $fetch('/api/validate-image', {
        method: 'POST',
        body: { url: val },
      })

      if (!res.valid || !res.url) {
        throw new Error(`L'URL n'est pas une image: ${val}`)
      }

      // Avoid duplicates
      if (!local.images?.includes(res.url)) {
        validatedUrls.push(res.url)
      }
    }

    if (validatedUrls.length === 0) {
      newImageError.value = 'Aucune nouvelle image à ajouter'
      return
    }

    local.images = [...(local.images ?? []), ...validatedUrls]
    newImageInput.value = ''
  } catch (e) {
    newImageError.value = e instanceof Error ? e.message : "Impossible d'ajouter cette image"
  } finally {
    addingImageLoading.value = false
  }
}

/**
 * Convert price number to string and vice versa
 */
const priceInput: ComputedRef<string> = computed<string>({
  /**
   * Convert price number to string and vice versa
   */
  get: () => (local.price == null ? '' : String(local.price)),
  /**
   * Convert string to price number
   * @param val - Price string input
   */
  set: (val: string) => {
    const trimmed: string = val.trim()
    const num: number | undefined = trimmed ? Number(trimmed.replace(',', '.')) : undefined
    local.price = Number.isFinite(num) ? num : undefined
  },
})
/**
 * Clear all form errors
 */
const clearErrors: () => void = (): void => {
  errors.name = ''
  errors.description = ''
  errors.price = ''
}

/**
 * Reset form to initial state
 */
const resetForm: () => void = (): void => {
  currentStep.value = 1
  scrapingUrl.value = ''
  newImageInput.value = ''
  newImageError.value = ''
  addingImageLoading.value = false
  Object.assign(local, DEFAULT_FORM_VALUES)
}

/**
 * Validate form fields
 * @returns true if form is valid, false otherwise
 */
const validateForm: () => boolean = (): boolean => {
  clearErrors()

  const name: string = (local.name || '').trim()
  const description: string = (local.description || '').trim()

  if (!name) {
    errors.name = 'Le nom est requis.'
    return false
  }

  if (name.length > FIELD_CONSTRAINTS.NAME_MAX) {
    errors.name = `Le nom ne doit pas dépasser ${FIELD_CONSTRAINTS.NAME_MAX} caractères.`
    return false
  }

  if (description && description.length > FIELD_CONSTRAINTS.DESCRIPTION_MAX) {
    errors.description = `La description ne doit pas dépasser ${FIELD_CONSTRAINTS.DESCRIPTION_MAX} caractères.`
    return false
  }

  if (local.price != null && local.price < 0) {
    errors.price = 'Le prix doit être positif.'
    return false
  }

  return true
}

/**
 * Handle URL input and scrape product data
 */
const handleScrapeUrl: () => Promise<void> = async (): Promise<void> => {
  urlError.value = ''

  try {
    new URL(scrapingUrl.value)
  } catch {
    urlError.value = 'URL invalide'
    return
  }

  const scrapedData: ScrapedProduct | null = await scraper.scrapeUrl(scrapingUrl.value)

  if (!scrapedData) {
    return
  }

  // Pre-fill form with scraped data
  local.name = scrapedData.name || ''
  local.description = scrapedData.description || ''
  local.price = scrapedData.price ?? undefined
  local.images = scrapedData.images
  local.url = scrapingUrl.value

  currentStep.value = 2
}

/**
 * Validate and move to preview step
 */
const goToPreview: () => void = (): void => {
  if (validateForm()) {
    currentStep.value = 3
  }
}

/**
 * Handle form submission
 */
const onSubmit: () => void = (): void => {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    name: local.name!,
    description: local.description,
    price: local.price,
    images: local.images,
    tags: local.tags,
    url: local.url,
    wishlistId: local.wishlistId,
    visibility: local.visibility,
  })

  resetForm()
}

/**
 * Update form when initialValues prop changes
 * If editing (has name), start at step 2
 */
watch(
  () => props.initialValues,
  (newValues: typeof props.initialValues) => {
    if (newValues) {
      Object.assign(local, newValues)
      // If we have data (editing mode), skip to step 2
      if (newValues.name) {
        currentStep.value = 2
      } else {
        currentStep.value = 1
      }
    }
  },
  { deep: true, immediate: true },
)

/**
 * Trigger form action based on current step
 */
const submit: () => void = (): void => {
  if (currentStep.value === 3) {
    onSubmit()
  } else if (currentStep.value === 2) {
    goToPreview()
  }
}

defineExpose({ submit })
</script>

<style scoped></style>
