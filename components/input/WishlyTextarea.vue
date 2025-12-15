<template>
  <div class="w-full">
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</label>
    <textarea
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength || undefined"
      class="w-full rounded-lg border px-4 py-2 focus:outline-none"
      :class="[
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500',
        disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * Props type definition
 * @typedef {Object} Props
 * @property {string} [modelValue] - The textarea content
 * @property {string} [label] - The label for the textarea
 * @property {string} [placeholder] - Placeholder text for the textarea
 * @property {number} [rows] - Number of rows for the textarea
 * @property {string} [error] - Error message to display
 * @property {boolean} [required] - Whether the textarea is required
 * @property {boolean} [disabled] - Whether the textarea is disabled
 * @property {number} [maxlength] - Maximum length of the textarea content
 */
type Props = {
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  error?: string
  required?: boolean
  disabled?: boolean
  maxlength?: number
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  rows: 3,
  error: '',
  required: false,
  disabled: false,
  maxlength: undefined,
})

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
