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
    <div class="relative px-4 sm:px-6 lg:px-8 bg-gray-800">
      <nav
        class="relative flex items-center justify-between lg:justify-start h-16"
        aria-label="Global"
      >
        <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
          <div class="flex items-center justify-between w-full md:w-auto">
            <router-link to="/" class="flex-shrink-0">
              <img class="w-52" src="@/assets/logo.png" alt="HelloChef" />
            </router-link>
            <div class="-mr-2 flex items-center md:hidden">
              <PopoverButton
                class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                <span class="sr-only">Open main menu</span>
                <MenuIcon class="h-6 w-6" aria-hidden="true" />
              </PopoverButton>
            </div>
          </div>
        </div>
        <div class="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :aria-current="item.current ? 'page' : undefined"
            :class="[
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'px-2 py-2 rounded-md font-medium cursor-pointer',
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
          class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div
            class="rounded-lg shadow-md bg-gray-800 ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <div class="px-5 pt-4 flex items-center justify-between">
              <router-link to="/" class="flex-shrink-0">
                <img class="w-52" src="@/assets/logo.png" alt="HelloChef" />
              </router-link>
              <div class="-mr-2">
                <PopoverButton
                  class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                >
                  <span class="sr-only">Close main menu</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
            <div class="px-2 pt-2 pb-3 space-y-1">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :aria-current="item.current ? 'page' : undefined"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block px-4 pl-10 py-2 rounded-md text-base font-medium cursor-pointer',
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
