<template>
  <div :class="wrapperClasses">
    <label v-if="label" class="mb-2 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="onInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <div v-if="error" class="mt-2 text-sm text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Input types
 * @typedef {'text' | 'email' | 'password'} InputType
 */
type InputType = 'text' | 'email' | 'password'

/**
 * Props interface for WishlyInput component.
 * @interface Props
 * @property {string} modelValue - The value of the input.
 * @property {InputType} type - The type of the input.
 * @property {string} label - The label for the input.
 * @property {string} placeholder - The placeholder text for the input.
 * @property {string | null} error - The error message for the input.
 * @property {boolean} disabled - Whether the input is disabled.
 * @property {boolean} required - Whether the input is required.
 * @property {string} autocomplete - The autocomplete attribute for the input.
 * @property {boolean} iconLeft - Whether there is an icon on the left side.
 * @property {boolean} iconRight - Whether there is an icon on the right side.
 */
type Props = {
  modelValue: string
  type: InputType
  label: string
  placeholder: string
  error: string | null
  disabled: boolean
  required: boolean
  autocomplete: string
  iconLeft: boolean
  iconRight: boolean
}

const props: Props = withDefaults(
  defineProps<{
    modelValue?: string
    type?: InputType
    label?: string
    placeholder?: string
    error?: string | null
    disabled?: boolean
    required?: boolean
    autocomplete?: string
    iconLeft?: boolean
    iconRight?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    label: '',
    placeholder: '',
    error: null,
    disabled: false,
    required: false,
    autocomplete: 'off',
    iconLeft: false,
    iconRight: false,
  },
)

/**
 * Emit events
 * @typedef {('update:modelValue' | 'focus' | 'blur')} EmitEvent
 * @typedef {EmitEvent} Emit
 * @typedef {{(e: 'update:modelValue', value: string): void; (e: 'focus', ev: FocusEvent): void; (e: 'blur', ev: FocusEvent): void}} Emit
 */
type Emit = {
  (e: 'update:modelValue', value: string): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}

const emit: Emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

const wrapperClasses: string = 'w-full'

const baseInput: string =
  'block w-full rounded-lg border px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none transition'

const inputClasses: ComputedRef<string> = computed(() => {
  const focusColor: string = 'focus:border-purple-500'
  const borderColor: string = props.error ? 'border-red-500' : 'border-gray-300'
  return [baseInput, borderColor, focusColor].join(' ')
})

/**
 * Handle input event
 * @param ev - Input event
 */
const onInput: (ev: Event) => void = (ev: Event): void => {
  const target: HTMLInputElement = ev.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
