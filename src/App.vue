<template>
  <div id="app">
    <!-- Header Section -->
    <header class="app-header">
      <div class="logo-container">
        <!-- Replace the src below with the correct path to your logo -->
        <img src="@/assets/logo.png" alt="SunGuard Logo" class="app-logo" />
      </div>
      <nav class="nav-links">
        <!-- If you have Vue Router set up: -->
        <router-link to="/">UV Index</router-link>
        <router-link to="/effects">Effects of Radiation</router-link>
        <router-link to="/reminders">Reminders</router-link>
        <router-link to="/gear">Sun Protection Gear</router-link>
        <router-link to="/community">Join Our Community</router-link>

        <!-- If you don't have Vue Router, use regular anchor tags:
        <a href="#">UV Index</a>
        <a href="#">Effects of Radiation</a>
        <a href="#">Reminders</a>
        <a href="#">Sun Protection Gear</a>
        <a href="#">Join Our Community</a>
        -->
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <!-- If using Vue Router, display the routed component here -->
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
/* Basic styling - adjust to match your design */
.app-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  border-bottom: 2px solid #eee;
}

.logo-container {
  margin-right: 2rem;
}

.app-logo {
  height: 50px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a,
.nav-links router-link {
  text-decoration: none;
  color: #333;
  font-weight: 600;
}

.nav-links a:hover,
.nav-links router-link:hover {
  color: #f39c12; /* Example hover color */
}

main {
  padding: 2rem;
}
</style>
