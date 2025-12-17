<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
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
      <label class="mb-1 block text-sm font-medium text-gray-700">URL</label>
      <WishlyInput v-model="urlInput" type="text" placeholder="https://..." :error="errors.url" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
      <WishlyInput v-model="tagsInput" type="text" placeholder="Ex: jouet, star wars" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Images (URLs, séparées par des virgules)</label>
      <WishlyInput v-model="imagesInput" type="text" placeholder="https://img1, https://img2" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import WishlyInput from '~/components/input/WishlyInput.vue'
import WishlyTextarea from '~/components/input/WishlyTextarea.vue'
import WishlySelect from '~/components/input/WishlySelect.vue'
import type { GiftVisibility } from '~/composables/useGifts'

/**
 * Gift form values
 * @property {string} name - Name of the gift
 * @property {string} description - Description of the gift
 * @property {number|null} price - Price of the gift
 * @property {string[]} images - Array of image URLs
 * @property {string[]} tags - Array of tags
 * @property {string|null} url - URL of the gift
 * @property {GiftVisibility} visibility - Visibility of the gift
 */
type GiftFormValues = {
  name: string
  description: string
  price: number | null
  images: string[]
  tags: string[]
  url: string | null
  visibility: GiftVisibility
}

const props: { initialValues?: Partial<GiftFormValues> } = withDefaults(
  defineProps<{
    initialValues?: Partial<GiftFormValues>
  }>(),
  {
    /**
     * Initial values for the form
     * @returns {GiftFormValues} - Default initial values
     */
    initialValues: () => ({
      name: '',
      description: '',
      price: null,
      images: [],
      tags: [],
      url: null,
      visibility: 'PRIVATE' as GiftVisibility,
    }),
  },
)

const emit: (e: 'submit', payload: GiftFormValues) => void = defineEmits<{
  (e: 'submit', payload: GiftFormValues): void
}>()

const local: GiftFormValues = reactive<GiftFormValues>({
  name: props.initialValues?.name ?? '',
  description: props.initialValues?.description ?? '',
  price: props.initialValues?.price ?? null,
  images: props.initialValues?.images ?? [],
  tags: props.initialValues?.tags ?? [],
  url: props.initialValues?.url ?? null,
  visibility: (props.initialValues?.visibility ?? 'PUBLIC') as GiftVisibility,
})

const errors: { name: string; description: string; price: string; url: string; visibility: string } = reactive({
  name: '',
  description: '',
  price: '',
  url: '',
  visibility: '',
})

const tagsInput: ComputedRef<string> = computed({
  /**
   * Get tags as a comma-separated string
   * @return {string} - Comma-separated tags
   */
  get: () => local.tags.join(', '),

  /**
   * Set tags from a comma-separated string
   * @param {string} val - Comma-separated tags
   */
  set: (val: string) => {
    local.tags = val
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)
  },
})

/** Get images as a comma-separated string
 * @return {string} - Comma-separated image URLs
 */
const imagesInput: ComputedRef<string> = computed({
  /**
   * Get images as a comma-separated string
   * @return {string} - Comma-separated image URLs
   */
  get: () => local.images.join(', '),

  /**
   * Set images from a comma-separated string
   * @param val - Comma-separated image URLs
   */
  set: (val: string) => {
    local.images = val
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)
  },
})

const urlInput: ComputedRef<string> = computed({
  /**
   * Get URL as a string
   * @return {string} - URL string
   */
  get: () => (local.url == null ? '' : local.url),
  /**
   * Set URL from a string
   * @param val - URL string
   */
  set: (val: string) => {
    const v: string = val.trim()
    local.url = v === '' ? null : v
  },
})

const priceInput: ComputedRef<string> = computed({
  /**
   * Get price as a string
   * @return {string} - Price string
   */
  get: () => (local.price == null ? '' : String(local.price)),

  /**
   * Set price from a string
   * @param val - Price string
   */
  set: (val: string) => {
    const v: string = val.trim()
    if (!v) {
      local.price = null
      return
    }
    const num: number = Number(v.replace(',', '.'))
    local.price = Number.isFinite(num) ? num : null
  },
})

watch(
  () => props.initialValues,
  (v: Partial<GiftFormValues> | undefined) => {
    local.name = v?.name ?? ''
    local.description = v?.description ?? ''
    local.price = v?.price ?? null
    local.images = v?.images ?? []
    local.tags = v?.tags ?? []
    local.url = v?.url ?? null
    local.visibility = (v?.visibility ?? 'PUBLIC') as GiftVisibility
  },
  { deep: true },
)

/**
 * Handle form submission
 * @return {void}
 */
const onSubmit: () => void = (): void => {
  errors.name = ''
  errors.description = ''
  errors.price = ''
  errors.url = ''
  errors.visibility = ''

  const nameVal: string = (local.name || '').trim()
  const descVal: string = (local.description || '').trim()

  if (!nameVal) {
    errors.name = 'Le nom est requis.'
    return
  }
  if (nameVal.length > 200) {
    errors.name = 'Le nom ne doit pas dépasser 200 caractères.'
    return
  }
  if (descVal && descVal.length > 2000) {
    errors.description = 'La description ne doit pas dépasser 2000 caractères.'
    return
  }
  if (local.price != null && local.price < 0) {
    errors.price = 'Le prix doit être positif.'
    return
  }

  emit('submit', {
    name: nameVal,
    description: descVal,
    price: local.price,
    images: local.images,
    tags: local.tags,
    url: local.url,
    visibility: local.visibility as GiftVisibility,
  })
}

/**
 * Expose submit method to parent components
 * @return {void}
 */
const submit: () => void = () => {
  onSubmit()
}
defineExpose({ submit })

// const { name, description, price, images, tags, url, visibility } = toRefs(local)
</script>

<style scoped></style>
