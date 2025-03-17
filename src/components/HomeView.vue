<template>
  <div class="container-fluid">
    <div class="home-box card shadow-sm my-4">
      <div class="card-body">
        <h2 class="card-title">Welcome to SunGuard</h2>
        <p class="card-text">
          Manage your sun exposure with real-time UV index data, expert advice,
          and tips for staying safe under the sun. Explore our features to learn
          about the effects of radiation, get reminders for sunscreen
          application, and discover recommended sun protection gear.
        </p>
        <div class="cta-buttons">
          <router-link to="/uv-index" class="btn btn-primary me-2">
            Check UV Index
          </router-link>
          <router-link to="/community" class="btn btn-warning">
            Join Our Community
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home-box {
  max-width: 900px;
  margin: 20px;
  text-align: left;
}

/* Typography adjustments */
.card-title {
  font-size: 2rem;
  font-weight: bold;
}

.card-text {
  font-size: 1.1rem;
  margin-top: 1rem;
}

.cta-buttons {
  margin-top: 1.5rem;
}

/* Media Query for Mobile Devices */
@media (max-width: 768px) {
  .home-box {
    margin: 10px;
    padding: 10px;
  }
  .card-title {
    font-size: 1.75rem;
  }
  .card-text {
    font-size: 1rem;
  }
  .cta-buttons {
    flex-direction: column;
    gap: 10px;
  }
  .cta-buttons .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
