import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalizedGeneric) => {
  // Skip on server to avoid false redirects during SSR
  if (process.server) return
  // If the route explicitly opts out, skip
  if (to.meta.public) return

  const { isAuthenticated, initializeAuth } = useAuth()

  if (process.client) {
    initializeAuth()
  }

  const privateRoutes: string[] = ['/account', '/wishlists', '/settings']
  const isPrivate: boolean | unknown = privateRoutes.some((p: string) => to.path.startsWith(p)) || to.meta.requiresAuth

  if (isPrivate && !isAuthenticated.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
