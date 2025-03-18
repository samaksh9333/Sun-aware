import { createRouter, createWebHistory } from "vue-router";
import UVIndex from "../components/UVIndex.vue"; // UV Index page as the home route
import PersonaliseView from "../components/PersonaliseView.vue";

const routes = [
  {
    path: "/",
    name: "uv-index",
    component: UVIndex,
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
