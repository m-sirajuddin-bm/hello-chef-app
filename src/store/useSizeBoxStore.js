import { defineStore } from "pinia";

export const sizeBoxStore = defineStore("sizeBox", {
  state: () => ({
    pricePerServing: 0,
    selectedSize: 0,
    selectedFamilySize: 0,
    selectedRecipeSize: 0,
  }),
  getters: {},
  actions: {
    setSelectedSize(val) {
      this.selectedSize = val;
    },
    setSelectedFamilySize(val) {
      this.selectedFamilySize = val;
    },
    setSelectedRecipeSize(val) {
      this.selectedRecipeSize = val;
    },
  },
});
