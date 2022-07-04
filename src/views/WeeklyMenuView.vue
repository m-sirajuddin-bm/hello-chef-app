<script setup>
import RecipeCard from "@/components/RecipeCard.vue";
import { onMounted, ref } from "vue";

const products = ref([]);

const weeks = ref([
  {
    label: "7 - 13",
    date: "2022-07-07",
  },
  {
    label: "14 - 20",
    date: "2022-07-14",
  },
  {
    label: "21 - 27",
    date: "2022-07-21",
  },
]);

const selectedWeek = ref(weeks.value[0]);

onMounted(async () => {
  await getData(selectedWeek.value.date);
});

async function getData(date) {
  const response = await fetch(
    `https://api.hellochef.me/api/weekly-menus/find?by=startDate&value=${date}&withNextWeek=1`,
  );
  const json = await response.json();
  products.value = json.data.weeklyMenu.recipes;
  console.log(products.value);
}

function selectWeek(week) {
  getData(week.date);
  selectedWeek.value = week;
}
</script>
<template>
  <div class="min-h-full">
    <main>
      <div
        class="shadow-sm border-b py-6 flex items-center justify-center gap-2 sm:flex-row flex-col"
      >
        <h1 class="text-3xl font-semibold text-gray-700">Weekly Menu</h1>
        <div class="gap-2 flex">
          <div v-for="(week, i) in weeks" :key="i">
            <button
              :class="[
                selectedWeek === week ? 'bg-orange-600' : '',
                'p-4 bg-orange-500/60 rounded-lg font-semibold hover:bg-orange-500/80',
              ]"
              @click="selectWeek(week)"
            >
              <span
                :class="[
                  selectedWeek === week ? 'text-white' : 'text-orange-700',
                ]"
              >
                {{ week.label }}</span
              >
            </button>
          </div>
        </div>
      </div>
      <div class="max-w-[1440px] mx-auto pb-8 sm:px-6 lg:px-8">
        <div
          class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-x-8"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="group relative flex justify-center"
          >
            <RecipeCard :product="product" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
