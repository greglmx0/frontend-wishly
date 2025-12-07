<template>
  <div
    class="relative rounded-2xl bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg md:text-left"
  >
    <div
      class="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 transform text-6xl opacity-5 md:left-0 md:translate-x-0"
    ></div>

    <div class="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <WishlyIcon :name="props.icon" :size="32" class="text-purple-600"></WishlyIcon>
    </div>

    <h3 class="mb-3 text-gray-900">{{ props.title }}</h3>
    <p class="text-gray-600">{{ props.description }}</p>
  </div>
</template>

<script setup lang="ts">
import WishlyIcon from '~/components/WishlyIcon.vue'

/**
 * @type {Props}
 * @property {string} title - Title of the step
 * @property {string} description - Description of the step
 */
type Props = {
  title: string
  description: string
  icon: string
}
const props: Props = defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>
