<script setup></script>

<template>
  <div
    class="bg-gray-50 bg-[url('https://res.cloudinary.com/hellochef/image/upload/c_scale,dpr_auto,f_auto,fl_progressive,q_auto,w_auto/v1/website/V2/homepage/banner')] bg-center bg-cover bg-no-repeat w-full h-96"
  >
    <div
      class="w-96 mx-auto py-16 px-8 flex flex-col items-center justify-between gap-5"
    >
      <h2
        class="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-4xl text-center"
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
            class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-700"
            >Get started</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
