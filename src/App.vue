<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { MenuIcon, XIcon } from "@heroicons/vue/outline";
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

const route = useRoute();

watch(
  () => route.path,
  (path) => {
    navigation.value.map((n) => (n.current = n.to === path));
  },
);

const navigation = ref([
  { name: "Home", to: "/", current: true },
  { name: "Our Plans", to: "/plans", current: false },
  { name: "Weekly Menu", to: "/weekly-menu", current: false },
]);
</script>

<template>
  <Popover v-slot="{ close }">
    <div class="relative bg-gray-800 px-4 sm:px-6 lg:px-8">
      <nav
        class="relative flex h-16 items-center justify-between lg:justify-start"
        aria-label="Global"
      >
        <div class="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
          <div class="flex w-full items-center justify-between md:w-auto">
            <router-link to="/" class="flex-shrink-0">
              <img class="w-52" src="@/assets/logo.png" alt="HelloChef" />
            </router-link>
            <div class="-mr-2 flex items-center md:hidden">
              <PopoverButton
                class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                <span class="sr-only">Open main menu</span>
                <MenuIcon class="h-6 w-6" aria-hidden="true" />
              </PopoverButton>
            </div>
          </div>
        </div>
        <div class="hidden md:ml-10 md:block md:space-x-8 md:pr-4">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :aria-current="item.current ? 'page' : undefined"
            :class="[
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'cursor-pointer rounded-md px-2 py-2 font-medium',
            ]"
            >{{ item.name }}</router-link
          >
        </div>
      </nav>
    </div>

    <transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div>
        <PopoverPanel
          focus
          class="absolute inset-x-0 top-0 z-20 origin-top-right transform p-2 transition md:hidden"
        >
          <div
            class="overflow-hidden rounded-lg bg-gray-800 shadow-md ring-1 ring-black ring-opacity-5"
          >
            <div class="flex items-center justify-between px-5 pt-4">
              <router-link to="/" class="flex-shrink-0">
                <img class="w-52" src="@/assets/logo.png" alt="HelloChef" />
              </router-link>
              <div class="-mr-2">
                <PopoverButton
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                >
                  <span class="sr-only">Close main menu</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
            <div class="space-y-1 px-2 pt-2 pb-3">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :aria-current="item.current ? 'page' : undefined"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block cursor-pointer rounded-md px-4 py-2 pl-10 text-base font-medium',
                ]"
                @click="
                  () => {
                    close();
                  }
                "
                >{{ item.name }}</router-link
              >
            </div>
          </div>
        </PopoverPanel>
      </div>
    </transition>
  </Popover>

  <RouterView />
</template>
