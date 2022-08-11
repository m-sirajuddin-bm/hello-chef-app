<script setup>
import FilterIcon from "@/assets/icons/filter.svg";
import CustomDialog from "@/components/CustomDialog.vue";
import FlatButton from "@/components/FlatButton.vue";
import RecipeCard from "@/components/RecipeCard.vue";
import { BASE_URL, FILTERS, SORTS, WEEKS } from "@/constants";
import { flatDeep } from "@/utils";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { ChevronDownIcon, XIcon } from "@heroicons/vue/outline";
import { onMounted, ref, watch } from "vue";

onMounted(async () => {
  await getData(selectedWeek.value.date);
});

const products = ref([]);
const filteredProducts = ref([]);

const getWeek = () => {
  const list = [];
  let startDate = new Date();
  const day = startDate.getDay();
  if (day > 4) {
    const diff = day - 4;
    startDate = new Date(new Date().setDate(startDate.getDate() - diff));
  } else if (day < 4) {
    const diff = 4 - day;
    startDate = new Date(new Date().setDate(startDate.getDate() - diff));
  }

  for (let i = 0; i < 4; i++) {
    const endDate = new Date().setDate(startDate.getDate() + 6);
    const startDay = startDate.format("dd");
    const endDay = new Date(endDate).format("dd");
    const nextMonth = new Date(new Date().setMonth(startDate.getDate() + 1));
    const month =
      startDay > endDay
        ? `${startDate.format("MMM")} - ${nextMonth.format("MMM")}`
        : startDate.format("MMM");
    list.push({
      label: `${startDay} - ${endDay}`,
      date: `${startDate.format("yyyy-MM-dd")}`,
      month,
    });
    startDate = new Date(startDate.setDate(startDate.getDate() + 7));
  }

  return list;
};
const weeks = ref(getWeek());
const selectedWeek = ref(WEEKS[0]);

const openSortByDialog = ref(false);
const sortApplied = ref(false);
const sorts = ref(SORTS);
const selectedSort = ref(SORTS[0]);
watch(selectedSort, (value) => {
  applySort(value);
});

const openFilterDialog = ref(false);
const filterApplied = ref(false);
const filters = ref(FILTERS);
const mainProteinsFilters = ref(
  filters.value.filter((f) => f.type === "protein"),
);
const recipeFeatureFilters = ref(
  filters.value.filter((f) => f.type === "feature"),
);
let recipeFeatureFilter = {};

async function getData(date) {
  try {
    const response = await fetch(
      `${BASE_URL}/weekly-menus/find?by=startDate&value=${date}&withNextWeek=1&with=recipes.mainProtein`,
    );
    const json = await response.json();
    // products.value = json?.data.weeklyMenu.recipes;
    const dt = json?.data?.weeklyMenu?.recipes;

    if (!dt) {
      return;
    }

    products.value = Object.values(dt).map((a) => a[0].recipe);

    // triger filter, if applied
    if (filterApplied.value) {
      // we need to retrigger select main protein for new set of products
      // to filter the recipe features based on the selected main protein
      recipeFeatureFilter = {};
      mainProteinsFilters.value.forEach((f) => {
        if (f.filtered) {
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
    // console.log(products.value.map((m) => m.dynamic_features));
  } catch (error) {
    console.error(error);
  }
}

function selectWeek(week) {
  getData(week.date);
  selectedWeek.value = week;
}

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

function handleOpenFilterDialog() {
  openFilterDialog.value = true;

  // set all the filtered as selected
  // this is to make sure, only filtered are selected
  // otherwise user can simply select the filter and
  // close the dialog without applying filter
  recipeFeatureFilter = {};
  mainProteinsFilters.value.forEach((item) => {
    item.selected = item.filtered;
    if (item.selected) {
      selectMainProtein(item, true);
    }
  });
}

function handleCloseFilterDialog() {
  openFilterDialog.value = false;
  if (!filterApplied.value) {
    clearFilter();
  }
}

function handleFilterShortcut(item) {
  if (item.type === "protein") {
    selectMainProtein(item);
  } else {
    selectRecipeFeature(item);
  }
  applyFilter();
}

function selectMainProtein(item, force = false) {
  // if force, do not unselected
  if (!force) item.selected = !item.selected;

  // get the product features for the selected main protein
  const filteredRecipes = products.value.filter((f) =>
    f.mainProtein.name.toLowerCase().startsWith(item.filterType.toLowerCase()),
  );

  // check for features
  let filteredRecipeFeatures = Array.from(
    new Set(
      flatDeep(filteredRecipes.map((a) => a.features)).map((a) => a.name),
    ),
  );

  // check for dynamic features
  let dynamicFeatures = filteredRecipes
    .map((m) => m.dynamic_features)
    .filter((f) => f.length);

  if (dynamicFeatures.length) {
    dynamicFeatures = Array.from(new Set(flatDeep(dynamicFeatures)));
    filteredRecipeFeatures = [...filteredRecipeFeatures, ...dynamicFeatures];
  }

  // check if the are weekly classic recipes for the selected main protein
  const weeklyClassic = filteredRecipes.filter((f) => f.weeklyClassic);
  if (weeklyClassic.length) {
    filteredRecipeFeatures.push("Weekly Classic");
  }

  if (item.selected) {
    // filter recipe features for the selected main protein
    filteredRecipeFeatures.forEach((pf) => {
      if (!(pf in recipeFeatureFilter)) {
        recipeFeatureFilter[pf] = 0;
      }
      recipeFeatureFilter[pf] += 1;
    });
  } else {
    // clear filter of recipe features for the unselected main protein
    filteredRecipeFeatures.forEach((pf) => {
      if (pf in recipeFeatureFilter) {
        recipeFeatureFilter[pf] -= 1;
      }

      // if the recipe feature filter is 0, then remove from the object
      // this is need to reset the recipe features filter if all the main proteins are unselected
      if (recipeFeatureFilter[pf] === 0) delete recipeFeatureFilter[pf];
    });
  }

  // if all the main protein are unselected, then enabled all the recipe features
  if (!Object.keys(recipeFeatureFilter).length) {
    recipeFeatureFilters.value.forEach((f) => {
      f.disabled = false;
    });
    return;
  }

  // filter recipe features based on the selected main protein
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

function clearAllFilter() {
  clearFilter();
  filterApplied.value = false;
  openFilterDialog.value = false;
}

function applyFilter() {
  openFilterDialog.value = false;

  // set all the filtered to false and select based on selected
  filters.value.forEach((item) => {
    item.filtered = false;
  });

  // get the protein filters mapped to filterType
  const proteinFilters = mainProteinsFilters.value
    .filter((f) => f.selected)
    .map((m) => {
      // set filtered to true to reselect the filtered after closing the filter dialog
      m.filtered = true;
      return m.filterType.toLowerCase();
    });

  // get feature filters mapped to filterType
  const featureFilters = recipeFeatureFilters.value
    .filter((f) => f.selected)
    .map((m) => {
      // set filtered to true to reselect the filtered after closing the filter dialog
      m.filtered = true;
      return m.filterType;
    });

  // after clear all filter and apply
  if (!proteinFilters.length && !featureFilters.length) {
    filterApplied.value = false;
    filteredProducts.value = [];
    return;
  }

  let proteinFilterApplied = false;
  // if there is protein filter then check for product's mainProtein names
  if (proteinFilters.length) {
    filteredProducts.value = products.value.filter((product) => {
      return proteinFilters.some((filterItem) =>
        product.mainProtein?.name.toLowerCase().startsWith(filterItem),
      );
    });
    proteinFilterApplied = true;
  }

  // if there is feature filter then check for product's features names
  if (featureFilters.length) {
    // if already proteinFilters is applied then filter items from filteredProducts
    // else filter from main products
    const productsToFilter = proteinFilterApplied ? filteredProducts : products;

    filteredProducts.value = productsToFilter.value.filter((product) =>
      featureFilters.some(
        (filterItem) =>
          filterItem === "Weekly Classic"
            ? product.weeklyClassic // weekly classic filter
            : product.features.map((m) => m.name).includes(filterItem) || // features filter
              product.dynamic_features.includes(filterItem), // dynamic features filter
      ),
    );
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
    item.filtered = false;
  });
  recipeFeatureFilter = {};
  filteredProducts.value = [];
}
</script>

<template>
  <div class="h-[calc(100%-64px)] bg-white sm:bg-gray-100">
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
                {{ week.label }}
                <span class="block font-medium">
                  {{ week.month }}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        class="invisible-scroll sticky top-0 z-10 flex items-center justify-start gap-2 overflow-x-auto whitespace-nowrap bg-white/95 p-3"
      >
        <FlatButton @onClick="handleOpenFilterDialog()" class="relative">
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

        <div v-if="filterApplied" class="flex items-center justify-start gap-2">
          <FlatButton
            v-for="(item, i) in filters.filter((f) => f.filtered)"
            :key="i"
            :selected="true"
          >
            <img
              :src="item.icon"
              class="-ml-1 mr-1 h-5 w-5 max-w-fit rounded text-gray-500"
              :alt="item.label"
            />

            {{ item.label }}

            <button type="button" @click="handleFilterShortcut(item)">
              <XIcon
                class="-mr-1 ml-2 h-5 w-5 text-orange-500/80 hover:opacity-80"
                aria-hidden="true"
              />
            </button>
          </FlatButton>
        </div>
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

      <div class="sticky top-[60px] z-10 border-b-2"></div>

      <div class="mx-auto max-w-[1440px] sm:py-8 sm:px-6 lg:px-8">
        <div
          v-if="
            (filterApplied && filteredProducts.length) ||
            (!filterApplied && products.length)
          "
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

        <div
          v-if="(filterApplied && !filteredProducts.length) || !products.length"
          class="py-12"
        >
          <h3 class="w-full text-center text-3xl font-semibold text-gray-600">
            No recipes to display!
          </h3>
        </div>
      </div>
    </main>
  </div>

  <CustomDialog
    :show="openFilterDialog"
    title="Filter by"
    @onBackDropClick="openFilterDialog = false"
    @onClose="handleCloseFilterDialog()"
  >
    <div class="flex flex-col">
      <h3 class="mb-2 text-lg font-semibold text-gray-700">Main Protein</h3>
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
      <h3 class="mb-2 text-lg font-semibold text-gray-700">Recipe Features</h3>
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
        @click="clearAllFilter()"
        ref="cancelButtonRef"
      >
        Clear all
      </button>

      <button
        type="button"
        class="w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
        @click="applyFilter()"
        ref="cancelButtonRef"
      >
        Apply filters
      </button>
    </div>
  </CustomDialog>

  <CustomDialog
    :show="openSortByDialog"
    title="Sort by"
    @onClose="openSortByDialog = false"
  >
    <RadioGroup v-model="selectedSort" class="w-full">
      <RadioGroupLabel class="sr-only"> Choose a sort option </RadioGroupLabel>
      <div class="flex flex-col gap-0">
        <RadioGroupOption
          as="template"
          v-for="(item, i) in sorts"
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
  </CustomDialog>
</template>
