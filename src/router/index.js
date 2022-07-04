import { createRouter, createWebHistory } from "vue-router";
import PlansView from "../views/PlansView.vue";
import WeeklyMenuView from "../views/WeeklyMenuView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/plans",
      name: "plans",
      component: PlansView,
    },
    {
      path: "/weekly-menu",
      name: "weekly-menu",
      component: WeeklyMenuView,
    },
  ],
});

export default router;
