<template>
  <div class="uv-index-page">
    <h1>Live UV Index</h1>
    <!-- Search Form -->
    <div class="search-controls">
      <input type="text" v-model="searchQuery" placeholder="Enter city name" />
      <button @click="fetchUVIndexByCity">Search by City</button>
      <button @click="fetchUVIndexCurrent">Use Current Location</button>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="uvIndex !== null">
      <p>
        UV Index for <strong>{{ displayLocation }}</strong
        >:
        <span :style="{ color: uvColor }">{{ uvIndex }}</span>
      </p>
      <!-- Visual representation of UV index -->
      <div class="uv-scale">
        <div
          class="uv-bar"
          :style="{ backgroundColor: uvColor, width: uvPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LiveUVIndex",
  data() {
    return {
      uvIndex: null,
      loading: false,
      error: null,
      lat: null,
      lon: null,
      searchQuery: "",
      displayLocation: "",
      apiKey: "07e31bea64b6d5e3a0d79991e19da066", // Replace with your actual API key
    };
  },
  computed: {
    // Determine the color based on UV index value
    uvColor() {
      if (this.uvIndex < 3) return "green";
      else if (this.uvIndex < 6) return "yellow";
      else if (this.uvIndex < 8) return "orange";
      else if (this.uvIndex < 11) return "red";
      else return "purple";
    },
    // Calculate a percentage for visual representation (assuming max UV index ~15)
    uvPercentage() {
      return Math.min((this.uvIndex / 15) * 100, 100);
    },
  },
  methods: {
    async fetchUVIndexByCoords(lat, lon, locationName = "") {
      this.loading = true;
      this.error = null;
      this.uvIndex = null;
      this.lat = lat;
      this.lon = lon;
      this.displayLocation = locationName || `lat: ${lat}, lon: ${lon}`;

      // Use the One Call API endpoint (v3 endpoint if subscribed; adjust if needed)
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${this.lat}&lon=${this.lon}&exclude=minutely,hourly,daily,alerts&appid=${this.apiKey}`;
      console.log("Fetching UV data from URL:", url);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          this.error = "Error fetching UV data: " + errorText;
          return;
        }
        const data = await response.json();
        console.log("API response:", data);
        if (data.current && data.current.uvi !== undefined) {
          this.uvIndex = data.current.uvi;
        } else {
          this.error = "Unexpected API response format.";
        }
      } catch (err) {
        console.error("Error fetching UV data:", err);
        this.error = "Error fetching UV data.";
      } finally {
        this.loading = false;
      }
    },
    async fetchUVIndexCurrent() {
      if (!navigator.geolocation) {
        this.error = "Geolocation is not supported by your browser.";
        return;
      }
      this.loading = true;
      this.error = null;
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          console.log("Current location:", coords);
          // Fetch UV data using the current location coordinates
          await this.fetchUVIndexByCoords(
            coords.latitude,
            coords.longitude,
            "Current Location"
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.error = "Unable to retrieve location.";
          this.loading = false;
        }
      );
    },
    async fetchUVIndexByCity() {
      if (!this.searchQuery) {
        this.error = "Please enter a city name.";
        return;
      }
      this.loading = true;
      this.error = null;
      // Use OpenWeatherMap Geocoding API to get coordinates for the city
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        this.searchQuery
      )}&limit=1&appid=${this.apiKey}`;
      console.log("Fetching geocoding data from URL:", geoUrl);
      try {
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
          const errorText = await geoResponse.text();
          console.error("Geocoding API error response:", errorText);
          this.error = "Error fetching location data: " + errorText;
          this.loading = false;
          return;
        }
        const geoData = await geoResponse.json();
        console.log("Geocoding API response:", geoData);
        if (geoData && geoData.length > 0) {
          const { lat, lon, name, country } = geoData[0];
          this.displayLocation = `${name}, ${country}`;
          // Fetch UV data using the obtained coordinates
          await this.fetchUVIndexByCoords(lat, lon, this.displayLocation);
        } else {
          this.error = "Location not found.";
        }
      } catch (err) {
        console.error("Error fetching geocoding data:", err);
        this.error = "Error fetching location data.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Optionally, you can auto-fetch current location data on mount.
    // this.fetchUVIndexCurrent();
  },
};
</script>

<style scoped>
.uv-index-page {
  text-align: center;
  padding: 2rem;
}
.search-controls {
  margin-bottom: 1rem;
}
.search-controls input {
  padding: 0.5rem;
  width: 200px;
  margin-right: 0.5rem;
}
.search-controls button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
}
.uv-scale {
  margin-top: 1rem;
  background-color: #eee;
  height: 20px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}
.uv-bar {
  height: 100%;
}
.error {
  color: red;
}
</style>
