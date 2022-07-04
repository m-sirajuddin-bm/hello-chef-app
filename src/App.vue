<script setup>
import { RouterView } from "vue-router";
const navigation = [
  { name: "Home", to: "/", current: false },
  { name: "Our Plans", to: "/plans", current: false },
  { name: "Weekly Menu", to: "/weekly-menu", current: false },
];
</script>

<template>
  <header as="nav" class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0">
            <img class="w-52" src="@/assets/logo.png" alt="HelloChef" />
          </router-link>
        </div>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex space-x-4">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
              ]"
              :aria-current="item.current ? 'page' : undefined"
              :to="item.to"
              >{{ item.name }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>
