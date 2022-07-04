<script setup>
import { sizeBoxStore } from "@/store/useSizeBoxStore";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  ChevronRightIcon,
  InformationCircleIcon,
  XIcon,
} from "@heroicons/vue/outline";
import { GiftIcon } from "@heroicons/vue/solid";
import { computed, ref } from "vue";

const sizeStore = sizeBoxStore();

const pricePerServing = ref({
  6: 51.1,
  8: 48.69,
  9: 46.32,
  10: 46.31,
  12: 41.04,
  15: 38.99,
  16: 36.68,
  20: 34.86,
});
const availableOffers = ref([
  {
    code: "NEW225",
    value: 225,
    occurance: [
      { text: "First", value: 100 },
      { text: "Second", value: 75 },
      { text: "Third", value: 50 },
    ],
  },
]);
const openDiscountDialog = ref(false);
const discountCode = ref("");
const discountApplied = ref(null);
const invalidDiscountCode = ref(false);

function applyDiscount(discount) {
  let offer = discount;
  if (discountCode.value) {
    offer = availableOffers.value.find(
      (f) => f.code.toUpperCase() === discountCode.value.toUpperCase(),
    );
  }

  if (!offer) {
    invalidDiscountCode.value = true;
    return;
  }
  discountApplied.value = offer;
  openDiscountDialog.value = true;
  discountCode.value = "";
}

const calculateServing = computed(() => {
  return (
    sizeStore.selectedRecipeSize *
    (sizeStore.selectedSize.type === "family"
      ? sizeStore.selectedFamilySize
      : 2)
  );
});

const calculatePricePerServing = computed(() =>
  pricePerServing.value[calculateServing.value]?.toFixed(2),
);

const calculateOriginalPrice = computed(() =>
  (calculateServing.value * calculatePricePerServing.value)?.toFixed(2),
);

const calculateFinalPrice = computed(() => {
  let total = Number(calculateOriginalPrice.value);
  if (discountApplied.value) {
    return (total - discountApplied.value.occurance[0].value).toFixed(2);
  }
  return total?.toFixed(2);
});
</script>

<template>
  <div class="shadow p-2 rounded-lg bg-white border flex-1 h-fit">
    <div class="p-4 pb-8 border-b">
      <div class="flex justify-between">
        <h3 class="text-md font-semibold text-gray-700">
          {{ sizeStore.selectedRecipeSize }} Recipes for
          {{
            sizeStore.selectedSize.type === "family"
              ? sizeStore.selectedFamilySize
              : 2
          }}
          People
        </h3>
        <span> {{ calculateServing }} Servings / Week </span>
      </div>

      <div
        v-if="sizeStore.selectedSize.type === 'single'"
        class="mt-3 px-4 py-3 bg-orange-50 rounded-lg flex items-center gap-2"
      >
        <InformationCircleIcon
          class="h-6 w-6 text-amber-700"
          aria-hidden="true"
        />
        <div>
          <span class="block font-semibold text-amber-700"
            >Cook once, eat twice!</span
          >
          <span class="block text-sm">
            Ordering for one? You'll have an additional serving per recipe to
            enjoy
          </span>
        </div>
      </div>
    </div>

    <div class="p-4 py-6 border-b flex flex-col gap-2">
      <div class="flex justify-between">
        <span class="text-gray-400">Price per Serving</span>
        <div class="flex gap-1">
          <span v-if="discountApplied" class="font-semibold line-through"
            >AED {{ calculatePricePerServing }}</span
          >
          <span
            :class="[
              'font-semibold',
              discountApplied ? 'text-orange-500/80' : '',
            ]"
            >AED {{ calculatePricePerServing }}</span
          >
        </div>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Weekly Total:</span>
        <div class="flex gap-1">
          <span v-if="discountApplied" class="font-semibold line-through"
            >AED {{ calculateOriginalPrice }}</span
          >
          <span
            :class="[
              'font-semibold',
              discountApplied ? 'text-orange-500/80' : '',
            ]"
            >AED {{ calculateFinalPrice }}</span
          >
        </div>
      </div>
    </div>

    <div class="p-4 py-6">
      <div v-if="!discountApplied">
        <h3 class="text-md font-semibold text-gray-700">
          Save more with a discount
        </h3>

        <div class="mt-2 mb-4 rounded-md shadow-sm">
          <div class="flex">
            <span
              class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50"
            >
              <GiftIcon class="h-6 w-6 text-gray-500" aria-hidden="true" />
            </span>
            <input
              type="text"
              name="discount-code"
              id="discount-code"
              class="focus:ring-orange-500 focus:border-orange-500 flex-1 block rounded-none sm:text-sm border-gray-300 h-12"
              placeholder="Discount Code"
              v-model="discountCode"
              @input="
                () => {
                  if (invalidDiscountCode) {
                    invalidDiscountCode = false;
                  }
                }
              "
            />
            <button
              class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 text-gray-400 font-semibold"
              @click="applyDiscount()"
            >
              Apply
            </button>
          </div>
          <p v-if="invalidDiscountCode" class="mt-1 text-sm text-red-500">
            Invalid discount code
          </p>
        </div>
      </div>

      <div v-if="!discountApplied">
        <div
          v-for="offer in availableOffers"
          :key="offer.code"
          :value="offer"
          class="mb-6 px-4 py-6 bg-gray-100 rounded-lg flex items-center justify-between gap-2"
        >
          <div>
            <span class="block font-semibold text-gray-600">{{
              offer.code
            }}</span>
            <span class="block text-sm text-gray-500">
              Save AED {{ offer.value }} off your first
              {{ offer.occurance.length }} boxes!
            </span>
          </div>
          <button
            class="text-orange-500/80 font-semibold"
            @click="applyDiscount(offer)"
          >
            Apply
          </button>
        </div>
      </div>

      <div
        v-if="discountApplied"
        class="flex items-center justify-between gap-2 mb-6"
      >
        <div>
          <span class="block font-semibold text-gray-700"
            >'{{ discountApplied.code }}' applied!</span
          >
          <span class="block text-sm text-[#5bc4a0]">
            You are saving AED {{ discountApplied.occurance[0].value }}
          </span>
          <button
            class="text-[#5bc4a0] flex items-center gap-2 text-sm"
            @click="openDiscountDialog = true"
          >
            <span class="underline">Learn More</span>
            <ChevronRightIcon class="w-3" />
          </button>
        </div>
        <button
          class="text-orange-500 flex items-center gap-2"
          @click="discountApplied = null"
        >
          <XIcon class="w-5" />
          <span>Remove</span>
        </button>
      </div>

      <button
        class="bg-red-500 text-white p-4 w-full rounded-md font-semibold hover:bg-red-600"
      >
        Select this plan
      </button>
    </div>
  </div>

  <TransitionRoot as="template" :show="openDiscountDialog">
    <Dialog as="div" class="relative z-10" @close="openDiscountDialog = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
      </TransitionChild>

      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div
          class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                <button
                  class="absolute right-6"
                  @click="openDiscountDialog = false"
                >
                  <div class="rounded-full p-1 border-2">
                    <XIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                </button>
                <div class="mt-3 text-center">
                  <div class="flex flex-col items-center">
                    <svg
                      viewBox="0 0 39 39"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-14"
                    >
                      <g
                        stroke="#5bc4a0"
                        stroke-width="3"
                        fill="none"
                        fill-rule="evenodd"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M37 17.9v1.61A17.5 17.5 0 1 1 26.623 3.517"
                        ></path>
                        <path d="M37 5.51 19.5 23.029l-5.25-5.25"></path>
                      </g>
                    </svg>
                    <div
                      class="text-xl leading-6 font-semibold text-[#5bc4a0] mt-10"
                    >
                      '{{ discountApplied.code }}' applied!
                    </div>
                    <div>You are saving a total of AED 225</div>
                  </div>
                  <div class="mt-4">
                    <div
                      class="border rounded-md w-full flex flex-col p-4 gap-3"
                    >
                      <div
                        class="flex justify-between"
                        v-for="(coupon, i) in discountApplied.occurance"
                        :key="coupon"
                        :value="coupon"
                      >
                        <span class="text-gray-400"
                          >{{ coupon.text }} Delivery</span
                        >
                        <span
                          :class="[
                            i === 0 ? 'text-[#5bc4a0]' : 'text-gray-700',
                          ]"
                        >
                          - AED {{ coupon.value }}</span
                        >
                      </div>

                      <div class="border-b border-2"></div>
                      <p class="text-gray-400 text-sm">
                        Discount on second and third deliveries are applied
                        automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 pb-6 sm:px-6">
                <button
                  type="button"
                  class="w-full border rounded-md p-3 border-orange-500/80 text-orange-500/80 font-semibold hover:opacity-80"
                  @click="openDiscountDialog = false"
                  ref="cancelButtonRef"
                >
                  Wohoo! Thanks
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
