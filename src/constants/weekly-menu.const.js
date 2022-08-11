import CalorieSmartIcon from "@/assets/icons/calorie_smart.svg";
import ChefChoiceIcon from "@/assets/icons/chef_choice.svg";
import ChickenIcon from "@/assets/icons/chicken.svg";
import FamilyFriendlyIcon from "@/assets/icons/family_friendly.svg";
import FishIcon from "@/assets/icons/fish.svg";
import GourmetIcon from "@/assets/icons/gourmet.svg";
import LowCarbIcon from "@/assets/icons/low_carb.svg";
import MeatIcon from "@/assets/icons/meat.svg";
import QuickEasyIcon from "@/assets/icons/quick_easy.svg";
import VeganIcon from "@/assets/icons/vegan.svg";
import WeeklyClassicIcon from "@/assets/icons/weekly_classic.svg";

export const SORTS = [
  {
    label: "Default",
    type: "default",
  },
  {
    label: "Calories: Low to High",
    type: "Calories",
  },
  {
    label: "Carbs: Low to High",
    type: "Carbs",
  },
  {
    label: "Cooking Time: Low to High",
    type: "CookingTime",
  },
  {
    label: "Protein: High to Low",
    type: "Protein",
  },
];

export const FILTERS = [
  {
    type: "protein",
    label: "Veg/Vegan",
    filterType: "Veg",
    icon: VeganIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "protein",
    label: "Fish",
    filterType: "Fish",
    icon: FishIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "protein",
    label: "Chicken",
    filterType: "Chicken",
    icon: ChickenIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "protein",
    label: "Meat",
    filterType: "Meat",
    icon: MeatIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Low carb",
    filterType: "Low Carb",
    icon: LowCarbIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Calorie smart",
    filterType: "Calorie smart",
    icon: CalorieSmartIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Family friendly",
    filterType: "Family Friendly",
    icon: FamilyFriendlyIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Quick & Easy",
    filterType: "Quick & Easy",
    icon: QuickEasyIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Weekly classic",
    filterType: "Weekly Classic",
    icon: WeeklyClassicIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Chef's choice",
    filterType: "Chef's choice",
    icon: ChefChoiceIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
  {
    type: "feature",
    label: "Gourmet",
    filterType: "Gourmet",
    icon: GourmetIcon,
    selected: false,
    disabled: false,
    filtered: false,
  },
];
