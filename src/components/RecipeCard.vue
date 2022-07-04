<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const { product } = toRefs(props);
const features = ref([]);
const imageUrl = ref("");
const featureColors = ref({
  "Low Carb": "text-orange-500",
  "Family Friendly": "text-blue-500",
  Vegetarian: "text-green-500",
  Vegan: "text-green-500",
  "Quick & Easy": "text-red-500",
  "Chef's choice": "text-red-500",
  "Calorie smart": "text-purple-500",
});

const init = async () => {
  let photo = product.value.photo;
  let url = photo.url;
  let urlSplit = url.split("/");
  urlSplit.pop();
  url = urlSplit.join("/");
  url = `${url}/c_scale,dpr_1.0,f_auto,fl_progressive,q_auto,w_400/${photo.publicId}`;
  imageUrl.value = url;

  const feat = product.value.features?.map((f) => f.name);
  features.value = [...feat, ...product.value.dynamic_features];
};

init();
</script>
<template>
  <div
    class="w-full h-full lg:max-w-sm bg-white aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none"
  >
    <img
      :src="imageUrl"
      :alt="product.cardName1"
      class="w-full h-52 object-center object-cover"
    />
    <div class="p-4 flex flex-col h-[calc(100%-208px)] justify-between">
      <div class="h-20">
        <h3 class="text-gray-600 font-semibold">{{ product.cardName1 }}</h3>
        <h3 class="text-gray-400 mt-1 text-sm">{{ product.cardName2 }}</h3>
      </div>
      <div class="flex flex-col gap-2 h-20 justify-end">
        <div class="flex gap-2 text-gray-600 text-sm">
          <span>{{ product.nutritions[0].value }} Cals</span>
          <span>|</span>
          <span>{{ product.cookingTime }} Min</span>
        </div>
        <div class="flex text-gray-600 text-sm">
          <span
            v-for="(feature, i) in features"
            :key="i"
            :class="[featureColors[feature], 'truncate']"
            >{{ feature
            }}<span
              v-if="features.length - 1 !== i"
              class="text-gray-700 mx-0.5 font-semibold"
              >&middot;</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
