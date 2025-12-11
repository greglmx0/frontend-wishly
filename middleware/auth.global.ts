import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalizedGeneric) => {
  // If the route explicitly opts out, skip
  if (to.meta.public) return

  const { isAuthenticated } = useAuth()

  // Protect known private routes by default
  const privateRoutes: string[] = ['/account', '/wishlists', '/settings']
  const isPrivate: boolean | unknown = privateRoutes.some((p: string) => to.path.startsWith(p)) || to.meta.requiresAuth

  if (isPrivate && !isAuthenticated.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
