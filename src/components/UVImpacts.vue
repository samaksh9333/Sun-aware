<template>
  <div class="container my-4">
    <h2 class="mb-4">Cancer Incidence Data</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else>
      <table class="table table-striped table-responsive">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cancer Type</th>
            <th>Year</th>
            <th>Sex</th>
            <th>State</th>
            <th>Count</th>
            <th>Crude Rate</th>
            <th>ASR 2001</th>
            <th>ASR 2024</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in cancerData" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.Cancer_Type }}</td>
            <td>{{ record.Year }}</td>
            <td>{{ record.Sex }}</td>
            <td>{{ record.State }}</td>
            <td>{{ record.Count }}</td>
            <td>{{ record.Crude_Rate }}</td>
            <td>{{ record.ASR_2001 }}</td>
            <td>{{ record.ASR_2024 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "CancerIncidence",
  data() {
    return {
      cancerData: [],
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchCancerData() {
      this.loading = true;
      this.error = null;
      try {
        // Replace with your actual backend endpoint URL if needed
        const response = await fetch(
          "http://localhost:3000/api/cancer-incidence"
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        this.cancerData = await response.json();
      } catch (err) {
        console.error("Error fetching cancer incidence data:", err);
        this.error = "Error fetching cancer incidence data: " + err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchCancerData();
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
.table-responsive {
  overflow-x: auto;
}
</style>
