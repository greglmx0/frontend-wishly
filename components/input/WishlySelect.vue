<template>
  <div class="w-full">
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      class="w-full rounded-lg border px-4 py-2 focus:outline-none"
      :class="[
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500',
        disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white',
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * Props type definition
 * @typedef {Object} Props
 * @property {string} [modelValue] - The selected value
 * @property {string} [label] - The label for the select input
 * @property {string} [error] - Error message to display
 * @property {boolean} [required] - Whether the select is required
 * @property {boolean} [disabled] - Whether the select is disabled
 */
type Props = {
  modelValue?: string
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  error: '',
  required: false,
  disabled: false,
})

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
