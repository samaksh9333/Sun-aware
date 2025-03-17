<template>
  <div class="container my-4">
    <div class="card shadow-sm personalise-card">
      <div class="card-body">
        <h2 class="card-title mb-4 text-center">
          Personal Sun Protection Recommendations
        </h2>
        <form @submit.prevent="generateRecommendations">
          <!-- Age Range -->
          <div class="mb-3">
            <label for="ageRange" class="form-label"
              >Select Your Age Range</label
            >
            <select v-model="ageRange" id="ageRange" class="form-select">
              <option disabled value="">-- Choose an age range --</option>
              <option value="under-18">Under 18</option>
              <option value="18-30">18 - 30</option>
              <option value="31-50">31 - 50</option>
              <option value="51-65">51 - 65</option>
              <option value="over-65">Over 65</option>
            </select>
          </div>

          <!-- Skin Type -->
          <div class="mb-3">
            <label for="skinType" class="form-label"
              >Select Your Skin Type</label
            >
            <select v-model="skinType" id="skinType" class="form-select">
              <option disabled value="">-- Choose your skin type --</option>
              <option value="1">Type 1 (Very fair, pale white)</option>
              <option value="2">Type 2 (Fair, usually burns easily)</option>
              <option value="3">Type 3 (Fair/Medium, burns moderately)</option>
              <option value="4">Type 4 (Olive/Moderate brown)</option>
              <option value="5">Type 5 (Brown/Dark brown)</option>
              <option value="6">
                Type 6 (Deeply pigmented dark brown to black)
              </option>
            </select>
          </div>

          <!-- Time in the Sun -->
          <div class="mb-3">
            <label for="timeOutside" class="form-label"
              >How long will you be outside?</label
            >
            <div class="input-group">
              <input
                type="number"
                id="timeOutside"
                v-model.number="timeOutside"
                class="form-control"
                placeholder="Enter duration"
                min="1"
              />
              <select v-model="timeUnit" class="form-select">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 mt-3">
            Get Recommendations
          </button>
        </form>

        <!-- Recommendations Display -->
        <div v-if="recommendations" class="mt-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Your Sun Protection Recommendations</h5>
              <p class="card-text" v-html="recommendations"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonaliseView",
  data() {
    return {
      ageRange: "",
      skinType: "",
      timeOutside: null,
      timeUnit: "minutes",
      recommendations: null,
    };
  },
  methods: {
    generateRecommendations() {
      // Convert time outside to minutes
      let totalMinutes = this.timeOutside;
      if (this.timeUnit === "hours") {
        totalMinutes = this.timeOutside * 60;
      }

      // Validate input: ensure all fields are filled
      if (!this.ageRange || !this.skinType || !this.timeOutside) {
        this.recommendations = `<strong>Please fill out all fields before getting recommendations.</strong>`;
        return;
      }

      let rec = "";

      // Skin Type Factor
      switch (this.skinType) {
        case "1":
          rec += "You have very fair skin (Type 1) and burn very easily. ";
          break;
        case "2":
          rec += "You have fair skin (Type 2) and tend to burn easily. ";
          break;
        case "3":
          rec += "You have fair/medium skin (Type 3) and burn moderately. ";
          break;
        case "4":
          rec +=
            "You have olive/moderate brown skin (Type 4) and burn minimally. ";
          break;
        case "5":
          rec +=
            "You have brown/dark brown skin (Type 5) with minimal sun sensitivity. ";
          break;
        case "6":
          rec +=
            "You have deeply pigmented dark brown to black skin (Type 6) with very low sun sensitivity. ";
          break;
        default:
          break;
      }

      // Age Factor
      if (this.ageRange === "under-18") {
        rec +=
          "As a younger individual, extra caution with sun exposure is recommended. ";
      } else if (this.ageRange === "over-65") {
        rec +=
          "Older adults may have more sensitive skin, so take extra protective measures. ";
      }

      // Time Factor
      if (totalMinutes <= 30) {
        rec +=
          "For short durations (under 30 minutes), consider wearing SPF 30+ sunscreen and a hat. ";
      } else if (totalMinutes <= 120) {
        rec +=
          "For moderate durations (30-120 minutes), use SPF 30+ or higher, reapply every 2 hours, and wear sunglasses. ";
      } else {
        rec +=
          "For extended durations (over 2 hours), use SPF 50+, reapply every 2 hours, wear protective clothing, sunglasses, and seek shade. ";
      }

      // Universal Advice
      rec +=
        "Avoid peak UV hours (usually 10 AM - 4 PM), stay hydrated, and monitor the UV index for real-time changes.";

      this.recommendations = rec;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 700px;
}

/* Card for the whole form */
.personalise-card {
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
}

/* Form label styling */
.form-label {
  font-weight: 600;
}

/* Adjust button styling for consistency */
.btn {
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .personalise-card {
    margin: 10px;
    padding: 15px;
  }
}
</style>
