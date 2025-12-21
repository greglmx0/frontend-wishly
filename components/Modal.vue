<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40" @click="onBackdrop" />
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        <div class="flex flex-shrink-0 items-center justify-between border-b px-4 py-3">
          <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button class="rounded p-2 text-gray-500 hover:bg-gray-100" @click="onClose">✕</button>
        </div>
        <div class="overflow-y-auto px-4 py-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex flex-shrink-0 items-center justify-end gap-2 border-t px-4 py-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Props type definition
 */
type PropsModal = {
  open: boolean
  title: string
  closeOnBackdrop: boolean
}

const props: PropsModal = withDefaults(defineProps<PropsModal>(), {
  closeOnBackdrop: true,
})

const emit: (e: 'close') => void = defineEmits<{ (e: 'close'): void }>()

/**
 * Emit close event
 * @return {void}
 */
const onClose: () => void = () => emit('close')

/**
 * Handle backdrop click
 * @return {void}
 */
const onBackdrop: () => void = () => {
  if (props.closeOnBackdrop) emit('close')
}
</script>
