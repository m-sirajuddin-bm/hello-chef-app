<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";

const emits = defineEmits(["onBackDropClick", "onClose"]);

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @click="emits('onClose')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10">
        <div
          class="flex min-h-full items-end justify-center text-center sm:items-center"
        >
          <TransitionChild
            as="template"
            enter="transition duration-300 ease-out"
            enter-from="translate-y-full opacity-0 sm:translate-y-0"
            enter-to="translate-y-0 opacity-100 sm:translate-y-0"
            leave="transition duration-300 ease-in"
            leave-from="translate-y-0 opacity-100 sm:translate-y-0"
            leave-to="translate-y-full opacity-0 sm:translate-y-0"
          >
            <DialogPanel
              class="relative w-full transform overflow-hidden rounded-t-2xl bg-white text-left shadow-xl transition-all sm:max-w-lg sm:rounded-2xl"
            >
              <div
                class="relative flex flex-col gap-4 bg-white px-6 py-5 sm:p-6 sm:pb-4"
              >
                <div class="flex items-center justify-center">
                  <h3 class="text-xl font-semibold text-gray-900">
                    {{ title }}
                  </h3>
                  <button class="absolute right-6" @click="emits('onClose')">
                    <div class="rounded-full border-2 p-1">
                      <XIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </button>
                </div>

                <slot></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
