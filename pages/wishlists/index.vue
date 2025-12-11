<template>within the button.</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWishlists } from '~/composables/useWishlists'

onMounted(() => {
  document.title = 'Mes Wishlists - Wishly'
  // fetch wishlists here
  const { list } = useWishlists()
  list()
})
</script>
