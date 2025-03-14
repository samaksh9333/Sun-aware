<template>
  <div class="main-frame">
    <h1>Live UV Index</h1>
    <!-- Search Form -->
    <div class="search-controls">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Enter city name or postcode, country"
      />
      <button @click="fetchUVIndexBySearch">Search</button>
      <button @click="fetchUVIndexCurrent">Use Current Location</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="uvIndex !== null" class="uv-info">
      <p>
        UV Index for <strong>{{ displayLocation }}</strong
        >:
        <span :style="{ color: uvColor }">{{ uvIndex }}</span>
      </p>
      <!-- Display warning message based on UV index -->
      <p class="warning-message">{{ uvWarning }}</p>
      <!-- Visual representation of UV index -->
      <div class="uv-scale">
        <div
          class="uv-bar"
          :style="{ backgroundColor: uvColor, width: uvPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Container for Legend and Map -->
    <div class="map-legend-container">
      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <span class="legend-color" style="background-color: green"></span>
          Low (0-2)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background-color: yellow"></span>
          Moderate (3-5)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background-color: orange"></span>
          High (6-7)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background-color: red"></span>
          Very High (8-10)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background-color: purple"></span>
          Extreme (11+)
        </div>
      </div>
      <!-- Map Container -->
      <div id="mapid"></div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";

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
      map: null,
      marker: null,
      defaultCountry: "AU", // default country code if only postcode is provided
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
    async fetchUVIndexByCoords(lat, lon, locationName = "") {
      this.loading = true;
      this.error = null;
      this.uvIndex = null;
      this.lat = lat;
      this.lon = lon;
      this.displayLocation =
        locationName || `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;

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
          await this.fetchUVIndexByCoords(
            coords.latitude,
            coords.longitude,
            "Current Location"
          );
          this.updateMarker(coords.latitude, coords.longitude);
          if (this.map) {
            this.map.setView([coords.latitude, coords.longitude], 10);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.error = "Unable to retrieve location.";
          this.loading = false;
        }
      );
    },
    async fetchUVIndexBySearch() {
      if (!this.searchQuery) {
        this.error = "Please enter a search query.";
        return;
      }
      this.loading = true;
      this.error = null;
      let query = this.searchQuery.trim();
      let isZip = false;

      // If the query has a comma or is purely numeric, treat it as a zip code search
      if (query.includes(",") || /^\d+$/.test(query)) {
        isZip = true;
      }

      if (isZip) {
        // If only postcode is provided without a country, use defaultCountry
        let parts = query.split(",");
        let zip = parts[0].trim();
        let country = parts[1] ? parts[1].trim() : this.defaultCountry;
        const zipUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},${country}&appid=${this.apiKey}`;
        console.log("Fetching geocoding (zip) data from URL:", zipUrl);
        try {
          const zipResponse = await fetch(zipUrl);
          if (!zipResponse.ok) {
            const errorText = await zipResponse.text();
            console.error("Zip API error response:", errorText);
            this.error = "Error fetching location data: " + errorText;
            this.loading = false;
            return;
          }
          const zipData = await zipResponse.json();
          console.log("Zip API response:", zipData);
          if (zipData && zipData.lat && zipData.lon) {
            this.displayLocation = `${zipData.name}, ${zipData.country}`;
            await this.fetchUVIndexByCoords(
              zipData.lat,
              zipData.lon,
              this.displayLocation
            );
            this.updateMarker(zipData.lat, zipData.lon);
            if (this.map) {
              this.map.setView([zipData.lat, zipData.lon], 10);
            }
          } else {
            this.error = "Location not found.";
          }
        } catch (err) {
          console.error("Error fetching zip data:", err);
          this.error = "Error fetching location data.";
        } finally {
          this.loading = false;
        }
      } else {
        // Use the direct geocoding API for city names
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
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
            await this.fetchUVIndexByCoords(lat, lon, this.displayLocation);
            this.updateMarker(lat, lon);
            if (this.map) {
              this.map.setView([lat, lon], 10);
            }
          } else {
            this.error = "Location not found.";
          }
        } catch (err) {
          console.error("Error fetching geocoding data:", err);
          this.error = "Error fetching location data.";
        } finally {
          this.loading = false;
        }
      }
    },
    initMap() {
      this.map = L.map("mapid").setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this.map);

      // Click on map to get UV data
      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        console.log("Map clicked at:", lat, lng);
        this.fetchUVIndexByCoords(
          lat,
          lng,
          `Lat: ${lat.toFixed(2)}, Lon: ${lng.toFixed(2)}`
        );
        this.updateMarker(lat, lng);
        this.map.setView([lat, lng], 10);
      });
    },
    updateMarker(lat, lon) {
      if (this.marker) {
        this.marker.setLatLng([lat, lon]);
      } else if (this.map) {
        this.marker = L.marker([lat, lon]).addTo(this.map);
      }
    },
  },
  mounted() {
    this.initMap();
    // Optionally, auto-fetch current location UV data on mount:
    // this.fetchUVIndexCurrent();
  },
};
</script>

<style scoped>
/* Main square frame */
.main-frame {
  width: 900px; /* Adjust as needed */
  height: 700px; /* Adjust as needed */
  margin: 2rem auto;
  border: 2px solid #ccc;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
}

h1 {
  margin: 0 0 1rem;
}

.search-controls {
  margin-bottom: 1rem;
}
.search-controls input {
  padding: 0.5rem;
  width: 250px;
  margin-right: 0.5rem;
}
.search-controls button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
}

/* UV info block */
.uv-info {
  margin-bottom: 1rem;
}

.uv-scale {
  margin-top: 0.5rem;
  background-color: #eee;
  height: 20px;
  width: 300px;
  margin-bottom: 1rem;
}
.uv-bar {
  height: 100%;
}

/* Map & legend container side-by-side */
.map-legend-container {
  display: flex;
  gap: 1rem;
  flex: 1;
  width: 100%;
  margin-top: 1rem;
}

/* Legend styling */
.legend {
  width: 150px;
  display: flex;
  flex-direction: column;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
.legend-color {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
}

/* Map container styling */
#mapid {
  flex: 1;
  border: 1px solid #ccc;
  height: 400px;
  width: 100%;
  max-width: 600px;
}

/* Warning message styling */
.warning-message {
  font-weight: bold;
  color: #d35400;
  margin-bottom: 1rem;
}

/* Error text */
.error {
  color: red;
}
</style>
