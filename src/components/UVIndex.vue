<template>
  <div class="container my-4">
    <h2 class="mb-4">Live UV Index</h2>
    <!-- Search Form -->
    <div class="row mb-3">
      <div class="col-md-8">
        <div class="input-group">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Enter city name or postcode, country"
          />
          <button class="btn btn-primary" @click="fetchUVIndexBySearch">
            Search
          </button>
          <button class="btn btn-secondary" @click="fetchUVIndexCurrent">
            Use Current Location
          </button>
        </div>
      </div>
    </div>

    <!-- Loading and Error Messages -->
    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- UV Index Information Card -->
    <div v-else-if="uvIndex !== null" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">
          UV Index for <strong>{{ displayLocation }}</strong>
        </h5>
        <p class="card-text">
          <span
            :style="{ color: uvColor, fontWeight: 'bold', fontSize: '1.5rem' }"
          >
            {{ uvIndex }}
          </span>
        </p>
        <p class="text-warning fw-bold">{{ uvWarning }}</p>
        <div class="progress" style="height: 20px">
          <div
            class="progress-bar"
            :style="{ width: uvPercentage + '%', backgroundColor: uvColor }"
            role="progressbar"
            :aria-valuenow="uvIndex"
            aria-valuemin="0"
            aria-valuemax="15"
          ></div>
        </div>
      </div>
    </div>

    <!-- Map and Image Section -->
    <div class="row">
      <!-- UV Index Scale Image Column -->
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body p-0">
            <img
              src="@/assets/uv-index-scale.png"
              alt="UV Index Scale"
              class="img-fluid"
              style="width: 100%; height: 100%; object-fit: contain"
            />
          </div>
        </div>
      </div>
      <!-- Map Column -->
      <div class="col-md-6">
        <div id="mapid" class="border" style="height: 400px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "UVIndex",
  data() {
    return {
      searchQuery: "",
      uvIndex: null,
      loading: false,
      error: null,
      displayLocation: "",
      map: null,
      marker: null,
      apiKey: "07e31bea64b6d5e3a0d79991e19da066",
    };
  },
  computed: {
    uvColor() {
      if (this.uvIndex < 3) return "green";
      else if (this.uvIndex < 6) return "yellow";
      else if (this.uvIndex < 8) return "orange";
      else if (this.uvIndex < 11) return "red";
      else return "purple";
    },
    uvPercentage() {
      return Math.min((this.uvIndex / 15) * 100, 100);
    },
    uvWarning() {
      if (this.uvIndex < 3) {
        return "Low risk: Minimal sun protection needed.";
      } else if (this.uvIndex < 6) {
        return "Moderate risk: Wear sunglasses and consider SPF 30+ sunscreen if outdoors for long.";
      } else if (this.uvIndex < 8) {
        return "High risk: Use broad-spectrum sunscreen SPF 30+ and wear a hat and protective clothing.";
      } else if (this.uvIndex < 11) {
        return "Very high risk: Use sunscreen SPF 50+, reapply frequently, and wear protective clothing and sunglasses.";
      } else {
        return "Extreme risk: Avoid direct sun exposure. Use high SPF sunscreen (50+), protective clothing, and seek shade.";
      }
    },
  },
  methods: {
    async fetchUVIndexBySearch() {
      this.loading = true;
      this.error = null;
      try {
        console.log("Searching for:", this.searchQuery);
        let geoUrl = "";
        const trimmedQuery = this.searchQuery.trim();
        const zipRegex = /^\d+$/;
        if (zipRegex.test(trimmedQuery)) {
          geoUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(
            trimmedQuery
          )},AU&appid=${this.apiKey}`;
        } else {
          geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            trimmedQuery
          )}&limit=1&appid=${this.apiKey}`;
        }
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
          throw new Error(`Geocoding HTTP error: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();
        if (!geoData || (Array.isArray(geoData) && geoData.length === 0)) {
          throw new Error("Location not found.");
        }
        let lat, lon, name, country;
        if (Array.isArray(geoData)) {
          ({ lat, lon, name, country } = geoData[0]);
        } else {
          lat = geoData.lat;
          lon = geoData.lon;
          name = geoData.name;
          country = geoData.country;
        }
        this.displayLocation = `${name}, ${country}`;
        const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${this.apiKey}`;
        const oneCallResponse = await fetch(oneCallUrl);
        if (!oneCallResponse.ok) {
          throw new Error(`One Call API error: ${oneCallResponse.status}`);
        }
        const oneCallData = await oneCallResponse.json();
        this.uvIndex = oneCallData.current.uvi;
        if (this.map) {
          this.map.setView([lat, lon], 10);
          if (this.marker) {
            this.marker.setLatLng([lat, lon]);
          } else {
            this.marker = L.marker([lat, lon]).addTo(this.map);
          }
        }
      } catch (err) {
        console.error("Error fetching UV index data:", err);
        this.error = "Error fetching UV index data: " + err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchUVIndexCurrent() {
      this.loading = true;
      this.error = null;
      if (!navigator.geolocation) {
        this.error = "Geolocation is not supported by your browser.";
        this.loading = false;
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log("Current location:", latitude, longitude);
            this.displayLocation = `Lat: ${latitude.toFixed(
              2
            )}, Lon: ${longitude.toFixed(2)}`;
            const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${this.apiKey}`;
            const oneCallResponse = await fetch(oneCallUrl);
            if (!oneCallResponse.ok) {
              throw new Error(`One Call API error: ${oneCallResponse.status}`);
            }
            const oneCallData = await oneCallResponse.json();
            this.uvIndex = oneCallData.current.uvi;
            if (this.map) {
              this.map.setView([latitude, longitude], 10);
              if (this.marker) {
                this.marker.setLatLng([latitude, longitude]);
              } else {
                this.marker = L.marker([latitude, longitude]).addTo(this.map);
              }
            }
          } catch (err) {
            console.error("Error fetching current UV index data:", err);
            this.error = "Error fetching UV index data: " + err.message;
          } finally {
            this.loading = false;
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          this.error = "Unable to retrieve current location.";
          this.loading = false;
        }
      );
    },

    initMap() {
      this.map = L.map("mapid").setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this.map);
    },
  },
  mounted() {
    this.initMap();
    // Optionally, auto-fetch current location data on mount:
    // this.fetchUVIndexCurrent();
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}

/* Custom responsive adjustments */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }
  #mapid,
  .card.h-100 {
    height: 300px !important;
  }
}
</style>
