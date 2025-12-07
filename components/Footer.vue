<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div class="col-span-1 md:col-span-2">
          <div class="mb-4 flex items-center gap-2">
            <span class="text-white">Wishly</span>
          </div>
          <p class="mb-4 max-w-md text-gray-400">
            La solution simple et moderne pour créer, organiser et partager vos listes de souhaits avec vos proches.
          </p>
          <div class="flex gap-4">
            <a
              href="#"
              class="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
              label="Suivez-nous sur Facebook"
            >
              <!-- <Facebook class="h-5 w-5" aria-hidden="true" /> -->
            </a>
            <a
              href="#"
              class="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
              label="Suivez-nous sur Twitter"
            >
              <!-- <Twitter class="h-5 w-5" aria-hidden="true" /> -->
            </a>
            <a
              href="#"
              class="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
              label="Suivez-nous sur Instagram"
            >
              <!-- <Instagram class="h-5 w-5" aria-hidden="true" /> -->
            </a>
          </div>
        </div>

        <div>
          <h3 class="mb-4 text-white">Produit</h3>
          <ul class="space-y-2">
            <li>
              <a href="#benefits" class="transition-colors hover:text-white"> Fonctionnalités </a>
            </li>
            <li>
              <a href="#" class="transition-colors hover:text-white"> Tarifs </a>
            </li>
            <li>
              <a href="#comment-ca-marche" class="transition-colors hover:text-white"> Comment ça marche </a>
            </li>
            <li>
              <a href="#" class="transition-colors hover:text-white"> Blog </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-white">Informations</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="transition-colors hover:text-white"> À propos </a>
            </li>
            <li>
              <a href="#" class="transition-colors hover:text-white"> Conditions d&apos;utilisation </a>
            </li>
            <li>
              <a href="#" class="transition-colors hover:text-white"> Politique de confidentialité </a>
            </li>
            <li>
              <a href="#contact" class="inline-flex items-center gap-1 transition-colors hover:text-white">
                <!-- <Mail class="h-4 w-4" aria-hidden="true" /> -->
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex w-full border-t border-gray-800 pt-8 text-center md:justify-center md:text-left">
        <p class="text-sm text-gray-400">
          © {{ currentYear }} Wishly. Tous droits réservés. Créé avec ❤️ pour simplifier vos moments spéciaux.
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const currentYear: number = new Date().getFullYear()
</script>

<style></style>
