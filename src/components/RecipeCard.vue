<script setup>
import CalorieSmartIcon from "@/assets/icons/calorie_smart.svg";
import ChickenIcon from "@/assets/icons/chicken.svg";
import FamilyFriendlyIcon from "@/assets/icons/family_friendly.svg";
import FishIcon from "@/assets/icons/fish.svg";
import GourmetIcon from "@/assets/icons/gourmet.svg";
import LowCarbIcon from "@/assets/icons/low_carb.svg";
import MeatIcon from "@/assets/icons/meat.svg";
import QuickEasyIcon from "@/assets/icons/quick_easy.svg";
import VeganIcon from "@/assets/icons/vegan.svg";
import VegetarianIcon from "@/assets/icons/vegetarian.svg";
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

const labelColors = {
  "Low Carb": "text-orange-500",
  "Family Friendly": "text-blue-500",
  Vegetarian: "text-green-500",
  Vegan: "text-green-500",
  "Quick & Easy": "text-red-500",
  "Chef's choice": "text-red-500",
  "Calorie smart": "text-purple-500",
  Fish: "text-red-600",
  Chicken: "text-red-600",
  Meat: "text-red-600",
};

const proteinIcon = {
  Vegetarian: VegetarianIcon,
  Vegan: VeganIcon,
  Fish: FishIcon,
  Chicken: ChickenIcon,
  Meat: MeatIcon,
};

const featuresIcon = {
  "Low Carb": LowCarbIcon,
  "Calorie smart": CalorieSmartIcon,
  "Family Friendly": FamilyFriendlyIcon,
  "Quick & Easy": QuickEasyIcon,
  Gourmet: GourmetIcon,
};

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
    class="aspect-w-1 aspect-h-1 lg:aspect-none flex h-full w-full cursor-pointer flex-row-reverse justify-between gap-2 overflow-hidden border-b bg-white p-4 group-hover:opacity-90 sm:block sm:rounded-xl sm:border sm:p-0 sm:shadow-sm sm:group-hover:border-orange-500 sm:group-hover:shadow-lg lg:max-w-sm"
  >
    <img
      :src="imageUrl"
      :alt="product.cardName1"
      class="h-52 w-48 rounded-xl object-cover object-center shadow-md sm:w-full sm:rounded-none sm:shadow-none"
    />
    <div
      class="flex flex-col justify-between pr-2 sm:h-[calc(100%-208px)] sm:p-4"
    >
      <div class="sm:h-20">
        <div class="mb-2 flex">
          <img
            :src="proteinIcon[product.mainProtein.name]"
            class="mr-1 h-5 w-5 rounded text-gray-500"
            alt=""
          />
          <h3
            :class="[
              'text-sm font-semibold text-gray-600',
              labelColors[product.mainProtein.name],
            ]"
          >
            {{ product.mainProtein.name.toUpperCase() }}
          </h3>
        </div>
        <h3 class="font-semibold text-gray-600">{{ product.cardName1 }}</h3>
        <h3 class="mt-1 text-sm text-gray-400">
          {{ product.cardName2 }}
        </h3>
      </div>
      <div class="flex flex-col justify-end gap-2 sm:h-20">
        <div class="flex gap-2 text-sm text-gray-600">
          <span>{{ product.nutritions[0].value }} Cals</span>
          <span>|</span>
          <span>{{ product.cookingTime }} Min</span>
        </div>
        <div class="flex text-sm text-gray-600">
          <div v-for="(feature, i) in features" :key="i">
            <div v-if="featuresIcon[feature]" class="flex">
              <img
                :src="featuresIcon[feature]"
                class="h-5 w-5 rounded text-gray-500"
                alt=""
              />

              <div v-if="features.length - 1 !== i" class="mx-1 text-gray-700">
                |
              </div>
            </div>

            <!-- <div
              v-if="!featuresIcon[feature]"
              :class="[labelColors[feature], 'truncate']"
            >
              {{ feature }}
              <span
                v-if="features.length - 1 !== i"
                class="text-gray-700 mx-0.5 font-semibold"
                >&middot;
              </span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
