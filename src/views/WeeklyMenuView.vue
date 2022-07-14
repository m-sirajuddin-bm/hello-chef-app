<script setup>
import CalorieSmartIcon from "@/assets/icons/calorie_smart.svg";
import ChickenIcon from "@/assets/icons/chicken.svg";
import FamilyFriendlyIcon from "@/assets/icons/family_friendly.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import FishIcon from "@/assets/icons/fish.svg";
import GourmetIcon from "@/assets/icons/gourmet.svg";
import LowCarbIcon from "@/assets/icons/low_carb.svg";
import MeatIcon from "@/assets/icons/meat.svg";
import QuickEasyIcon from "@/assets/icons/quick_easy.svg";
import VeganIcon from "@/assets/icons/vegan.svg";
import WeeklyClassicIcon from "@/assets/icons/weekly_classic.svg";
import FlatButton from "@/components/FlatButton.vue";
import RecipeCard from "@/components/RecipeCard.vue";
import { BASE_URL } from "@/constants/app.const.js";
import { flatDeep } from "@/utils";
import {
  Dialog,
  DialogPanel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronDownIcon, XIcon } from "@heroicons/vue/outline";
import { onMounted, ref, watch } from "vue";

onMounted(async () => {
  await getData(selectedWeek.value.date);
});

const products = ref([]);
const filteredProducts = ref([]);
const openFilterDialog = ref(false);
const openSortByDialog = ref(false);
const filterApplied = ref(false);

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

async function getData(date) {
  try {
    const response = await fetch(
      `${BASE_URL}/weekly-menus/find?by=startDate&value=${date}&withNextWeek=1&with=recipes.mainProtein`,
    );
    const json = await response.json();
    products.value = json?.data.weeklyMenu.recipes;

    // triger filter, if applied
    if (filterApplied.value) {
      // we need to retrigger select main protein for new set of products
      // to update the recipe features based on the selected main protein
      mainProteinsFilters.value.forEach((f) => {
        if (f.selected) {
          selectMainProtein(f, true);
        }
      });
      applyFilter();
    }

    // trigger sort, if applied
    if (sortApplied.value) {
      applySort();
    }

    // console.log(products.value);
  } catch (error) {
    console.error(error);
  }
}

function selectWeek(week) {
  getData(week.date);
  selectedWeek.value = week;
}

const filters = ref([
  {
    type: "protein",
    label: "Veg/Vegan",
    filterType: "Veg",
    icon: VeganIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "protein",
    label: "Fish",
    filterType: "Fish",
    icon: FishIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "protein",
    label: "Chicken",
    filterType: "Chicken",
    icon: ChickenIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "protein",
    label: "Meat",
    filterType: "Meat",
    icon: MeatIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "feature",
    label: "Low carb",
    filterType: "Low Carb",
    icon: LowCarbIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "feature",
    label: "Calorie smart",
    filterType: "Calorie Smart",
    icon: CalorieSmartIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "feature",
    label: "Family friendly",
    filterType: "Family Friendly",
    icon: FamilyFriendlyIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "feature",
    label: "Quick & Easy",
    filterType: "Quick & Easy",
    icon: QuickEasyIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "feature",
    label: "Weekly classic",
    filterType: "Weekly Classic",
    icon: WeeklyClassicIcon,
    selected: false,
    disabled: false,
  },
  {
    type: "feature",
    label: "Gourmet",
    filterType: "Gourmet",
    icon: GourmetIcon,
    selected: false,
    disabled: false,
  },
]);
const mainProteinsFilters = ref(
  filters.value.filter((f) => f.type === "protein"),
);
const recipeFeatureFilters = ref(
  filters.value.filter((f) => f.type === "feature"),
);

const sortCriteria = ref([
  {
    label: "Default",
    type: "default",
  },
  {
    label: "Calories: Low to High",
    type: "Calories",
  },
  {
    label: "Carbs: Low to High",
    type: "Carbs",
  },
  {
    label: "Cooking Time: Low to High",
    type: "CookingTime",
  },
  {
    label: "Protein: High to Low",
    type: "Protein",
  },
]);
const selectedSort = ref(sortCriteria.value[0]);
const sortApplied = ref(false);

watch(selectedSort, (value) => {
  applySort(value);
});

function applySort(value = null) {
  value = value ? value : selectedSort.value;

  let productsToSort = filterApplied.value ? filteredProducts : products;
  sortApplied.value = true;

  switch (value.type) {
    case "Calories":
    case "Carbs":
      productsToSort.value.sort(
        (a, b) =>
          a.nutritions.find((f) => f.name === value.type).value -
          b.nutritions.find((f) => f.name === value.type).value,
      );
      break;
    case "Protein":
      productsToSort.value.sort(
        (a, b) =>
          b.nutritions.find((f) => f.name === value.type).value -
          a.nutritions.find((f) => f.name === value.type).value,
      );
      break;
    case "CookingTime":
      productsToSort.value.sort((a, b) => a.cookingTime - b.cookingTime);
      break;
    default:
      productsToSort.value.sort((a, b) => a.number - b.number);
      sortApplied.value = false;
      break;
  }

  openSortByDialog.value = false;
}

let recipeFeatureFilter = {};
function selectMainProtein(item, force = false) {
  // if force, do not unselected
  if (!force) item.selected = !item.selected;

  // get the product features for the selected protein
  const proteinFeatures = Array.from(
    new Set(
      flatDeep(
        products.value
          .filter((f) =>
            f.mainProtein.name
              .toLowerCase()
              .startsWith(item.filterType.toLowerCase()),
          )
          .map((a) => a.features),
      ).map((a) => a.name),
    ),
  );

  // if selected, add else remove
  if (item.selected) {
    // filter recipe features for the selected protein
    proteinFeatures.forEach((pf) => {
      if (!(pf in recipeFeatureFilter)) {
        recipeFeatureFilter[pf] = 0;
      }
      recipeFeatureFilter[pf] += 1;
    });
  } else {
    // clear filter of recipe features for the unselected protein
    proteinFeatures.forEach((pf) => {
      if (pf in recipeFeatureFilter) {
        recipeFeatureFilter[pf] -= 1;
      }

      // if the recipe feature filter is 0, then remove from the object
      // this is need to reset the recipe features filter if all the proteins are unselected
      if (recipeFeatureFilter[pf] === 0) delete recipeFeatureFilter[pf];
    });
  }

  // if all the proteins are unselected, then enabled all the recipe features
  if (!Object.keys(recipeFeatureFilter).length) {
    recipeFeatureFilters.value.forEach((f) => {
      f.disabled = false;
    });
    return;
  }

  // filter recipe features based on the protein selected
  recipeFeatureFilters.value.forEach((f) => {
    f.disabled = !recipeFeatureFilter[f.filterType];
    // if the item is disabled but already selected then unselect
    if (f.disabled && f.selected) {
      f.selected = false;
    }
  });
}

function selectRecipeFeature(item) {
  item.selected = !item.selected;
}

function applyFilter() {
  // get the protein filters mapped to filterType
  const proteinFilters = filters.value
    .filter((f) => f.selected && f.type === "protein")
    .map((m) => m.filterType.toLowerCase());

  // get feature filters mapped to filterType
  const featureFilters = filters.value
    .filter((f) => f.selected && f.type === "feature")
    .map((m) => m.filterType);

  // after clear all filter and apply
  if (!proteinFilters.length && !featureFilters.length) {
    filterApplied.value = false;
    filteredProducts.value = [];
    return;
  }

  // if there is protein filter then check for product's mainProtein names
  if (proteinFilters.length) {
    filteredProducts.value = products.value.filter((product) => {
      return proteinFilters.some((filterItem) =>
        product.mainProtein?.name.toLowerCase().startsWith(filterItem),
      );
    });
  }

  // if there is feature filter then check for product's features names
  if (featureFilters.length) {
    // if already proteinFilters is applied then filter items from filteredProducts
    // else filter from main products
    const productsToFilter = filteredProducts.value.length
      ? filteredProducts
      : products;

    filteredProducts.value = productsToFilter.value.filter((product) => {
      return featureFilters.some((filterItem) => {
        return product.features.map((m) => m.name).includes(filterItem);
      });
    });
  }

  filterApplied.value = true;

  // trigger sort, if applied
  if (sortApplied.value) {
    applySort();
  }
}

function clearFilter() {
  filters.value.forEach((item) => {
    item.selected = false;
    item.disabled = false;
  });
  recipeFeatureFilter = {};
  filteredProducts.value = [];
}
</script>

<template>
  <div class="min-h-full bg-white sm:bg-gray-100">
    <main>
      <div
        class="flex flex-col items-center justify-center gap-2 bg-white pt-6 pb-2 shadow-sm sm:flex-row"
      >
        <h1 class="text-3xl font-semibold text-gray-700">Weekly Menu</h1>
        <div class="flex gap-2">
          <div v-for="(week, i) in weeks" :key="i">
            <button
              :class="[
                selectedWeek === week
                  ? 'bg-orange-600 hover:bg-orange-600/80'
                  : 'bg-orange-500/60 hover:bg-orange-500/80',
                'rounded-lg  p-4 font-semibold ',
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

      <div
        class="sticky top-0 z-10 flex h-16 items-center justify-start gap-2 overflow-x-auto whitespace-nowrap bg-white/95 p-3"
      >
        <FlatButton @onClick="openFilterDialog = true" class="relative">
          Filters

          <span
            v-if="filterApplied"
            class="absolute right-2 top-2.5 h-1.5 w-1.5 rounded-full bg-orange-500"
          ></span>

          <img
            :src="FilterIcon"
            class="-mr-1 ml-2 h-5 w-5 max-w-fit text-gray-500"
            alt=""
          />
        </FlatButton>

        <FlatButton @onClick="openSortByDialog = true" :selected="sortApplied">
          {{
            selectedSort.label === "Default" ? "Sort by" : selectedSort.label
          }}
          <ChevronDownIcon
            class="-mr-1 ml-2 h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
        </FlatButton>
      </div>

      <div v-if="filterApplied" class="bg-white px-3">
        <div class="flex items-center justify-between py-2">
          <h3 class="text-base font-semibold text-gray-900">
            Showing {{ filteredProducts.length }} filtered recipes
          </h3>

          <button
            type="button"
            class="flex items-center gap-2 rounded-md border-orange-500/80 p-2 font-semibold text-orange-500/80 hover:opacity-80"
            @click="
              clearFilter();
              filterApplied = false;
            "
          >
            <XIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
            Clear all
          </button>
        </div>
      </div>

      <div class="sticky top-[62px] z-10 border-b-2"></div>

      <div class="mx-auto max-w-[1440px] sm:py-8 sm:px-6 lg:px-8">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 sm:gap-y-8 md:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <div
            v-for="product in filterApplied ? filteredProducts : products"
            :key="product.id"
            class="group relative flex justify-center"
          >
            <RecipeCard :product="product" />
          </div>
        </div>

        <h3
          v-if="(filterApplied && !filteredProducts.length) || !products.length"
          class="w-full text-center text-3xl font-semibold text-gray-600"
        >
          No products to display!
        </h3>
      </div>
    </main>
  </div>

  <TransitionRoot as="template" :show="openFilterDialog">
    <Dialog
      as="div"
      class="relative z-10"
      @close="
        openFilterDialog = false;
        !filterApplied ? clearFilter() : '';
      "
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0 translate-y-full"
        enter-to="opacity-100 translate-y-0"
        leave="ease-in duration-300"
        leave-from="opacity-100 translate-y-0"
        leave-to="opacity-0 translate-y-full"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center text-center sm:items-center"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-full"
            enter-to="opacity-100 translate-y-0"
            leave="ease-in duration-300"
            leave-from="opacity-100 translate-y-0"
            leave-to="opacity-0 translate-y-full"
          >
            <DialogPanel
              class="relative w-full transform overflow-hidden rounded-t-2xl bg-white text-left shadow-xl transition-all sm:max-w-lg sm:rounded-2xl"
            >
              <div
                class="relative flex flex-col gap-4 bg-white px-6 py-5 sm:p-6 sm:pb-4"
              >
                <div class="flex items-center justify-center">
                  <h3 class="text-xl font-semibold text-gray-900">Filter by</h3>
                  <button
                    class="absolute right-6"
                    @click="
                      openFilterDialog = false;
                      !filterApplied ? clearFilter() : '';
                    "
                  >
                    <div class="rounded-full border-2 p-1">
                      <XIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </button>
                </div>

                <div class="flex flex-col">
                  <h3 class="mb-2 text-lg font-semibold text-gray-700">
                    Main Protein
                  </h3>
                  <div class="flex flex-row flex-wrap gap-3">
                    <FlatButton
                      v-for="(item, i) in mainProteinsFilters"
                      :key="i"
                      :selected="!item.disabled && item.selected"
                      :disabled="item.disabled"
                      @onClick="selectMainProtein(item)"
                    >
                      <img
                        :src="item.icon"
                        :class="['-ml-1 mr-1 h-5 w-5 rounded text-gray-500']"
                        alt=""
                      />
                      {{ item.label }}
                    </FlatButton>
                  </div>
                </div>

                <div class="border-b"></div>

                <div class="flex flex-col">
                  <h3 class="mb-2 text-lg font-semibold text-gray-700">
                    Recipe Features
                  </h3>
                  <div class="flex flex-row flex-wrap gap-3">
                    <FlatButton
                      v-for="(item, i) in recipeFeatureFilters"
                      :key="i"
                      :selected="!item.disabled && item.selected"
                      :disabled="item.disabled"
                      @onClick="selectRecipeFeature(item)"
                    >
                      <img
                        :src="item.icon"
                        class="-ml-1 mr-1 h-5 w-5 rounded text-gray-500"
                        alt=""
                      />
                      {{ item.label }}
                    </FlatButton>
                  </div>
                </div>

                <div class="flex gap-4 bg-gray-50">
                  <button
                    type="button"
                    class="w-full rounded-md border border-orange-500/80 p-3 font-semibold text-orange-500/80 hover:opacity-80"
                    @click="
                      clearFilter();
                      filterApplied = false;
                      openFilterDialog = false;
                    "
                    ref="cancelButtonRef"
                  >
                    Clear all
                  </button>

                  <button
                    type="button"
                    class="w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
                    @click="
                      applyFilter();
                      openFilterDialog = false;
                    "
                    ref="cancelButtonRef"
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot as="template" :show="openSortByDialog">
    <Dialog as="div" class="relative z-10" @close="openSortByDialog = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0 translate-y-full"
        enter-to="opacity-100 translate-y-0"
        leave="ease-in duration-300"
        leave-from="opacity-100 translate-y-0"
        leave-to="opacity-0 translate-y-full"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center text-center sm:items-center"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-full"
            enter-to="opacity-100 translate-y-0"
            leave="ease-in duration-300"
            leave-from="opacity-100 translate-y-0"
            leave-to="opacity-0 translate-y-full"
          >
            <DialogPanel
              class="relative w-full transform overflow-hidden rounded-t-2xl bg-white text-left shadow-xl transition-all sm:max-w-lg sm:rounded-2xl"
            >
              <div
                class="relative flex flex-col gap-4 bg-white px-6 py-5 sm:p-6 sm:pb-4"
              >
                <div class="flex items-center justify-center">
                  <h3 class="text-xl font-semibold text-gray-900">Sort by</h3>
                  <button
                    class="absolute right-6"
                    @click="openSortByDialog = false"
                  >
                    <div class="rounded-full border-2 p-1">
                      <XIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </button>
                </div>

                <RadioGroup
                  v-model="selectedSort"
                  onChange="{setPlan}"
                  class="w-full"
                >
                  <RadioGroupLabel class="sr-only">
                    Choose a sort option
                  </RadioGroupLabel>
                  <div class="flex flex-col gap-0">
                    <RadioGroupOption
                      as="template"
                      v-for="(item, i) in sortCriteria"
                      :key="i"
                      :value="item"
                      v-slot="{ checked }"
                    >
                      <div
                        class="group relative flex cursor-pointer items-center justify-start border-b px-4 py-3 text-sm font-medium focus:outline-none sm:flex-1"
                      >
                        <RadioGroupLabel as="span" class="w-full">
                          <div class="flex items-center gap-2">
                            <input
                              :checked="checked"
                              name="size-radios"
                              type="radio"
                              class="h-4 w-4 border-gray-500 text-orange-500/80 focus:ring-orange-500/80"
                            />
                            <span
                              :class="[
                                checked ? 'font-bold' : 'font-light',
                                'ml-2 block text-base text-gray-700',
                              ]"
                              >{{ item.label }}</span
                            >
                          </div>
                        </RadioGroupLabel>
                        <span
                          :class="['pointer-events-none absolute -inset-px']"
                          aria-hidden="true"
                        />
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
