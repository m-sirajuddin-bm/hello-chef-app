<script setup>
import { sizeBoxStore } from "@/store/useSizeBoxStore";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";

defineProps({
  size: {
    type: Object,
    required: true,
  },
  familySize: {
    type: Object,
    required: true,
  },
});

const sizeStore = sizeBoxStore();
</script>

<template>
  <RadioGroupOption as="template" v-slot="{ active, checked }">
    <div
      :class="[
        'bg-gray-100 shadow-sm text-gray-900 cursor-pointer',
        active ? 'ring-1 ring-orange-500/80' : '',
        checked ? 'bg-white shadow-md' : '',
        'group relative border rounded-md px-4 py-3 flex items-center justify-start text-sm font-medium hover:bg-gray-50 focus:outline-none sm:flex-1',
      ]"
    >
      <RadioGroupLabel as="span" class="w-full">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <input
              :checked="checked"
              name="size-radios"
              type="radio"
              class="focus:ring-orange-500/80 h-4 w-4 text-orange-500/80 border-gray-500"
            />
            <span
              :class="[
                checked ? 'font-bold text-orange-500/80' : 'font-light',
                'ml-2 block text-base text-gray-700',
              ]"
              >{{ size.name }}</span
            >
          </div>
          <img
            :src="'src/assets/icons/' + size.icon + '.svg'"
            class="w-8"
            alt=""
          />
        </div>
        <div v-if="checked && size.type === 'family'">
          <div class="border-b pt-3"></div>
          <div class="pt-3">
            <h3 class="text-md font-light text-gray-700">
              How many are you cooking for?
            </h3>
            <div class="mt-4">
              <RadioGroup v-model="sizeStore.selectedFamilySize" class="w-full">
                <RadioGroupLabel class="sr-only">
                  Choose a family size
                </RadioGroupLabel>
                <div class="flex flex-row gap-0">
                  <RadioGroupOption
                    as="template"
                    v-for="(family, i) in familySize"
                    :key="family"
                    :value="family"
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
                          >{{ family }}</span
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
      </RadioGroupLabel>
      <span
        :class="[
          checked ? 'border-orange-500/80' : 'border-transparent',
          'absolute -inset-px rounded-md pointer-events-none border',
        ]"
        aria-hidden="true"
      />
    </div>
  </RadioGroupOption>
</template>
