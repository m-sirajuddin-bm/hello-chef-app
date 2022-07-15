<script setup></script>

<template>
  <div
    class="h-96 w-full bg-gray-50 bg-[url('https://res.cloudinary.com/hellochef/image/upload/c_scale,dpr_auto,f_auto,fl_progressive,q_auto,w_auto/v1/website/V2/homepage/banner')] bg-cover bg-center bg-no-repeat"
  >
    <div
      class="mx-auto flex w-96 flex-col items-center justify-between gap-5 py-16 px-8"
    >
      <h2
        class="text-center text-4xl font-extrabold tracking-tight text-gray-700 sm:text-4xl"
      >
        <span class="block">Say hello to a new way of cooking</span>
      </h2>
      <span class="block text-gray-500"
        >Delicious recipes. Delivered by us, made by you. Ready to unbox
        mealtime?</span
      >
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <router-link
            to="/plans"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
            >Get started</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
