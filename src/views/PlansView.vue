<script setup>
import RecipeBox from "@/components/RecipeBox.vue";
import SizeBox from "@/components/SizeBox.vue";
import { sizeBoxStore } from "@/store/useSizeBoxStore";
import { onUnmounted } from "vue";

const sizeStore = sizeBoxStore();

onUnmounted(() => {
  sizeStore.$reset();
});
</script>

<template>
  <div class="min-h-full">
    <main>
      <div class="max-w-6xl mx-auto py-8 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-semibold text-gray-700 text-center pb-8">
          Personalise Your Box
        </h1>

        <div class="flex flex-col gap-3 w-full lg:flex-row">
          <SizeBox />
          <RecipeBox />
        </div>
      </div>
    </main>
  </div>
</template>
