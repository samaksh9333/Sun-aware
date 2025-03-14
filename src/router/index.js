import { createRouter, createWebHistory } from "vue-router";
import UVIndex from "../components/UVIndex.vue"; // UV Index page as the home route
// import EffectsView from "../views/EffectsView.vue";
// import RemindersView from "../views/RemindersView.vue";
// import GearView from "../views/GearView.vue";
// import CommunityView from "../views/CommunityView.vue";

const routes = [
  {
    path: "/",
    name: "uv-index",
    component: UVIndex,
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
