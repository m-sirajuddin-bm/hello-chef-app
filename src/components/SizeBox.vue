<script setup>
import { sizeBoxStore } from "@/store/useSizeBoxStore";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { ref, watch } from "vue";
import SizeCard from "./SizeCard.vue";

const sizeStore = sizeBoxStore();

const product = {
  sizes: [
    { type: "single", name: "Just me", icon: "single" },
    { type: "double", name: "My partner and I", icon: "double" },
    { type: "family", name: "My family", icon: "family" },
  ],
  recipeSize: [3, 4, 5],
  familySize: [2, 3, 4],
};

const selectedSize = ref(product.sizes[0]);

sizeStore.setSelectedSize(product.sizes[0]);
sizeStore.setSelectedFamilySize(product.familySize[2]);
sizeStore.setSelectedRecipeSize(product.recipeSize[0]);

watch(selectedSize, (val) => {
  let recipeSize = 0;
  if (val.type === "single") {
    recipeSize = product.recipeSize[0];
  } else {
    recipeSize = product.recipeSize[1];
  }
  sizeStore.setSelectedSize(val);
  sizeStore.setSelectedRecipeSize(recipeSize);
});
</script>

<template>
  <div class="shadow rounded-lg bg-white border flex-1 h-fit">
    <div class="border-b p-6">
      <h3 class="text-md font-semibold text-gray-700">
        Who are you cooking for?
      </h3>
      <RadioGroup v-model="selectedSize" class="mt-4">
        <RadioGroupLabel class="sr-only"> Choose a size </RadioGroupLabel>
        <div class="flex flex-col gap-3">
          <SizeCard
            v-for="size in product.sizes"
            :key="size.name"
            :value="size"
            :size="size"
            :familySize="product.familySize"
          />
        </div>
      </RadioGroup>
    </div>

    <div class="p-6">
      <h3 class="text-md font-semibold text-gray-700">
        How many recipes per week?
      </h3>
      <div class="pt-2">
        <RadioGroup v-model="sizeStore.selectedRecipeSize" class="w-full">
          <RadioGroupLabel class="sr-only">
            Choose a recipes count
          </RadioGroupLabel>
          <div class="flex flex-row gap-0">
            <RadioGroupOption
              as="template"
              v-for="(count, i) in product.recipeSize"
              :key="count"
              :value="count"
              v-slot="{ active, checked }"
            >
              <div
                :class="[
                  'white shadow-sm text-gray-900 cursor-pointer',
                  checked
                    ? 'bg-orange-400/80 !text-white rounded-md border-0 ring-1 ring-orange-400/80'
                    : '',
                  i === 0 ? 'rounded-l-md' : '',
                  i === 2 ? 'rounded-r-md' : '',
                  'group relative border p-2 flex items-center justify-center text-sm font-medium focus:outline-none flex-1',
                ]"
              >
                <RadioGroupLabel as="span" class="text-center">
                  <span
                    :class="[
                      checked ? 'font-semibold' : '',
                      'flex flex-1 text-base',
                    ]"
                    >{{ count }}</span
                  >
                </RadioGroupLabel>
                <span
                  :class="[
                    active ? 'border' : 'border-2',
                    'absolute -inset-px rounded-md pointer-events-none border-transparent',
                  ]"
                  aria-hidden="true"
                />
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>
