import { createRouter, createWebHistory } from "vue-router";
import UVIndex from "../components/UVIndex.vue"; // UV Index page as the home route
import HomeView from "../components/HomeView.vue";
import UVImpacts from "../components/UVImpacts";
// import EffectsView from "../views/EffectsView.vue";
// import RemindersView from "../views/RemindersView.vue";
// import GearView from "../views/GearView.vue";
// import CommunityView from "../views/CommunityView.vue";

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
  //   {
  //     path: "/effects",
  //     name: "effects",
  //     component: EffectsView,
  //   },
  //   {
  //     path: "/reminders",
  //     name: "reminders",
  //     component: RemindersView,
  //   },
  //   {
  //     path: "/gear",
  //     name: "gear",
  //     component: GearView,
  //   },
  //   {
  //     path: "/community",
  //     name: "community",
  //     component: CommunityView,
  //   },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
