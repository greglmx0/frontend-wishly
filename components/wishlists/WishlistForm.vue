<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Nom</label>
      <WishlyInput
        v-model="local.name"
        type="text"
        placeholder="Ex: Anniversaire 2025"
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
        required
      />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Visibilité</label>
      <WishlySelect v-model="local.visibility" :error="errors.visibility" required>
        <option value="PUBLIC">Publique</option>
        <option value="PRIVATE">Privée</option>
        <option value="FRIENDS_ONLY">Amis seulement</option>
      </WishlySelect>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import WishlyInput from '../input/WishlyInput.vue'
import WishlyTextarea from '../input/WishlyTextarea.vue'
import WishlySelect from '../input/WishlySelect.vue'
import type { Visibility } from '~/composables/useWishlists'

/**
 * Visibility type for wishlists
 * @property {string} [name] - Name of the wishlist (optional)
 * @property {string} [description] - Description of the wishlist (optional)
 * @property {Visibility} [visibility] - Visibility of the wishlist (optional)
 */
type WishlistFormProps = {
  name: string
  description: string
  visibility: Visibility
}

const props: WishlistFormProps = withDefaults(defineProps<WishlistFormProps>(), {
  name: '',
  description: '',
  visibility: 'PUBLIC',
})

const emit: (e: 'submit', payload: WishlistInput) => void = defineEmits<{
  (e: 'submit', payload: WishlistInput): void
}>()

const local: WishlistFormProps = reactive({
  name: props.name,
  description: props.description,
  visibility: props.visibility as Visibility,
})

const errors: { name: string; description: string; visibility: string } = reactive<{
  name: string
  description: string
  visibility: string
}>({
  name: '',
  description: '',
  visibility: '',
})

watch(
  () => [props.name, props.description, props.visibility],
  () => {
    local.name = props.name
    local.description = props.description
    local.visibility = props.visibility as Visibility
  },
)

/**
 * Handle form submission
 * @return {void}
 */
const onSubmit: () => void = () => {
  errors.name = ''
  errors.description = ''
  errors.visibility = ''

  const nameVal: string = local.name.trim()
  const descriptionVal: string = local.description.trim()
  const visVal: string = local.visibility

  if (!nameVal) {
    errors.name = 'Le nom est requis.'
    return
  }

  if (nameVal.length > 200) {
    errors.name = 'Le nom ne doit pas dépasser 200 caractères.'
    return
  }

  if (!descriptionVal) {
    errors.description = 'La description est requise.'
    return
  }

  if (descriptionVal.length > 2000) {
    errors.description = 'La description ne doit pas dépasser 2000 caractères.'
    return
  }

  if (!visVal) {
    errors.visibility = 'La visibilité est requise.'
    return
  }

  emit('submit', {
    name: nameVal,
    description: local.description,
    visibility: local.visibility as Visibility,
  } as WishlistInput)
}

/**
 * Expose submit method to parent components
 */
const submit: () => void = () => {
  onSubmit()
}
defineExpose({ submit })
</script>
