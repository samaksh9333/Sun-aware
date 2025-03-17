<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img src="@/assets/logo.png" alt="SunAware Logo" height="40" />
          SunAware
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/uv-index"
                >UV Index</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/uv-impacts"
                >UV Impacts</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/reminders"
                >Reminders</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/gear"
                >Sun Protection Gear</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/community"
                >Join Our Community</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
