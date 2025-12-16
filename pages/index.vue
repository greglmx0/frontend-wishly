<template>
  <section class="bg-gradient-to-b from-purple-50 to-white py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="text-center lg:text-left">
          <h1 class="mb-6 text-gray-900">Crée, organise et partage tes wishlists en toute simplicité</h1>
          <p class="mx-auto mb-8 max-w-xl text-gray-600 lg:mx-0">
            Que ce soit pour ton anniversaire, Noël ou ton mariage, Wishly t&apos;aide à créer des listes de souhaits
            personnalisées et à les partager facilement avec tes proches.
          </p>
          <WishlyButton variant="primary" size="lg" href="/wishlists">
            Créer ma wishlist
            <WishlyIcon name="material-symbols:arrow-forward-ios" size="16" class="text-white" />
          </WishlyButton>
          <p class="mt-4 text-sm text-gray-500">Gratuit et sans engagement</p>
        </div>

        <div class="relative">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1719706654529-ca7e2ce5a2bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwY2VsZWJyYXRpb24lMjBiaXJ0aGRheXxlbnwxfHx8fDE3NjUwMzc1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Célébration avec cadeaux et moments de partage"
              class="aspect-square h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-white py-20" id="comment-ca-marche">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-16 text-center">
        <h2 class="mb-4 text-gray-900">Comment ça marche ?</h2>
        <p class="mx-auto max-w-2xl text-gray-600">
          Créer et partager ta wishlist n&apos;a jamais été aussi simple. Suis ces trois étapes et fais plaisir à tes
          proches.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-3 lg:gap-12">
        <CardLoadingPage
          v-for="step in steps"
          :key="step.id"
          :icon="step.icon"
          :title="step.title"
          :description="step.description"
        ></CardLoadingPage>
      </div>
    </div>
  </section>
  <section class="bg-gradient-to-b from-gray-50 to-white py-20" id="benefits">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-16 text-center">
        <h2 class="mb-4 text-gray-900">Pourquoi choisir Wishly ?</h2>
        <p class="mx-auto max-w-2xl text-gray-600">
          Une solution pensée pour rendre le partage de souhaits simple, efficace et agréable pour tout le monde.
        </p>
      </div>

      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <CardLoadingPage
          v-for="benefit in benefits"
          :key="benefit.id"
          :icon="benefit.icon"
          :title="benefit.title"
          :description="benefit.description"
        ></CardLoadingPage>
      </div>

      <div class="mt-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-12 text-center text-white">
        <h2 class="mb-4 text-white">Prêt à commencer ?</h2>
        <p class="mx-auto mb-8 max-w-2xl text-purple-50">
          Rejoins des milliers d&apos;utilisateurs qui simplifient leurs événements spéciaux avec Wishly.
        </p>
        <WishlyButton variant="secondary" size="lg" href="/wishlists"> Créer ma wishlist maintenant </WishlyButton>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import WishlyIcon from '~/components/WishlyIcon.vue'
import WishlyButton from '~/components/input/WishlyButton.vue'
import CardLoadingPage from '~/components/CardLoadingPage.vue'

definePageMeta({
  layout: 'header',
})

/**
 * @type {Step}
 * @property {string} number - Step number
 * @property {any} icon - Icon component for the step
 * @property {string} title - Title of the step
 * @property {string} description - Description of the step
 */
type Step = {
  id: number
  icon: string
  title: string
  description: string
}
const steps: Step[] = [
  {
    id: 1,
    icon: 'stash:list-add',
    title: 'Crée ta wishlist',
    description:
      'En quelques clics, crée une wishlist personnalisée pour n&apos;importe quelle occasion : anniversaire, mariage, Noël ou simplement pour garder tes envies en un seul endroit.',
  },
  {
    id: 2,
    icon: 'mdi:sparkles',
    title: 'Ajoute tes idées cadeaux',
    description:
      'Remplis ta liste avec tous tes souhaits : livres, gadgets, expériences... Ajoute des descriptions, des liens et des images pour guider tes proches.',
  },
  {
    id: 3,
    icon: 'material-symbols:share',
    title: 'Partage avec tes proches',
    description:
      'Envoie ta wishlist à ta famille et tes amis en un simple clic. Ils pourront voir ce qui te ferait plaisir et réserver leurs cadeaux pour éviter les doublons.',
  },
]

const benefits: Step[] = [
  {
    id: 1,
    icon: 'grommet-icons:validate',
    title: 'Simplicité avant tout',
    description:
      'Interface intuitive et facile à utiliser. Crée ta wishlist en moins de 2 minutes, même si tu n&apos;es pas un pro de la tech.',
  },
  {
    id: 2,
    icon: 'majesticons:user-line',
    title: 'Partage facile',
    description:
      'Un simple lien suffit pour partager ta wishlist avec tes amis et ta famille. Pas besoin de créer des comptes multiples.',
  },
  {
    id: 3,
    icon: 'uiw:reload',
    title: 'Mise à jour en temps réel',
    description:
      'Ajoute, modifie ou supprime des souhaits à tout moment. Tes proches voient les changements instantanément.',
  },
  {
    id: 4,
    icon: 'fluent:shield-task-16-regular',
    title: 'Évite les doublons',
    description:
      'Grâce au système de réservation, tes proches peuvent marquer les cadeaux qu&apos;ils vont t&apos;offrir. Fini les doublons embarrassants !',
  },
]
</script>
