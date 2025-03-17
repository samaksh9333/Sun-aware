import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../components/HomeView.vue";
import UVIndex from "../components/UVIndex.vue"; // UV Index page as the home route
import UVImpacts from "../components/UVImpacts.vue";
import PersonaliseView from "../components/PersonaliseView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/uv-index",
    name: "uv-index",
    component: UVIndex,
  },
  {
    path: "/uv-impacts",
    name: "uv-impacts",
    component: UVImpacts,
  },
  {
    path: "/personalise-view",
    name: "personalise-view",
    component: PersonaliseView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
