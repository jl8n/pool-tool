<script setup>
import { ref, onMounted, computed } from 'vue'
import { QIcon, QToggle } from 'quasar'
import { poolSetState, fetchDashboard, fetchSchedules, fetchAll } from '../fetches/poolFetch.ts'
import { parseVisibleFeatures } from '../fetches/poolHelper.ts'

const poolDataAll = ref([])
const poolSchedules = ref([])
const poolVisibleFeatures = ref([])
const poolTemps = ref({ // Will hold the fetched dashboard data
  air: '',
  units: {
    name: ''
  },
  bodies: []
})

const pool = computed(() => poolTemps.value?.bodies.find(body => body.type.name === 'pool'))
const spa = computed(() => poolTemps.value?.bodies.find(body => body.type.name === 'spa'))

onMounted(async () => {
  try {
    poolTemps.value = await fetchDashboard()
    poolSchedules.value = await fetchSchedules()
    poolDataAll.value = await fetchAll()
    poolVisibleFeatures.value = parseVisibleFeatures(poolDataAll.value)
  } catch (error) {
    console.error('Error fetching data:', error.message)
    // Consider setting an error state here and displaying it in the template
  }
})

const toggleFeature = async (item, newState) => {
  try {
    // Call the poolSetState function
    await poolSetState(item.id, newState, item.equipmentType)

    // Update the local state to reflect the change
    item.isOn = newState
    console.log('State updated for ID:', item.id)
  } catch (error) {
    console.error('Error updating state:', error.message)
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="header">
      <div class="pool-name">EasyTouch2 8</div>
      <div class="date-time">12/13/2023 10:15am</div>
      <div class="status">Ready</div>
      <q-icon name="settings" class="config-gear" />
    </div>
    <div class="content">
      <div class="left-column">
        <div class="temperature-display">
          <div class="air-temp">Air Temp: {{ poolTemps?.air }}°{{ poolTemps?.units?.name }}</div>
          <div class="section pool" v-if="poolTemps && pool">
            <div class="section-header">{{ pool.name }}</div>
            <div class="temperature-current">{{ pool.setPoint }}°</div>
            <div class="temperature-info">Set Point: {{ pool.setPoint }}°{{ poolTemps?.units?.name }}</div>
            <div class="temperature-info">Heat Mode: {{ pool.heatMode.desc }}</div>
            <div class="temperature-info">Heater Status: {{ pool.heatStatus.desc }}</div>
          </div>
          <div class="section spa" v-if="poolTemps && spa">
            <div class="section-header">{{ spa.name }}</div>
            <div class="temperature-current">{{ spa.setPoint }}°</div>
            <div class="temperature-info">Set Point: {{ spa.setPoint }}°{{ poolTemps?.units?.name }}</div>
            <div class="temperature-info">Heat Mode: {{ spa.heatMode.desc }}</div>
            <div class="temperature-info">Heater Status: {{ spa.heatStatus.desc }}</div>
          </div>
        </div>
        <!-- Pumps Section -->
        <div class="section pumps">
          <div class="section-header">Pumps</div>
          <!-- Pump Components -->
        </div>
      </div>
      <div class="right-column">
        <!-- Features Section -->
        <div class="features">
          <div class="section-header">Features</div>
          <!-- Features Toggle Components -->
          <div class="q-gutter-y-md">
            {{poolVisibleFeatures.value}}
            <div v-for="obj in poolVisibleFeatures" :key="obj.id" class="flex items-center">
              <q-toggle :label="obj.name" :model-value="obj.isOn"
                @update:model-value="newState => toggleFeature(obj, newState)"></q-toggle>
            </div>
          </div>
        </div>
        <!-- Schedules Section -->
        <div class="section schedules">
          <div class="section-header">Schedules</div>
          <div v-for="schedule in poolSchedules" :key="schedule.id" class="schedule-item">
      <strong>{{ schedule.name }}</strong> {{ schedule.startTime }} - {{ schedule.endTime }}
      <table class="days-table">
        <tr>
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
        <tr>
          <td v-for="(day, index) in schedule.days" :key="index">
            <span v-if="day === 1">✓</span>
          </td>
        </tr>
      </table>
    </div>

          <!-- Schedules Components -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 768px; /* Set a max-width that works well on all devices */
  margin: 0 auto; /* Center the dashboard in the available space */
  padding: 1rem; /* Add padding around the dashboard for spacing */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.header {
  background-color: #009688; /* Example header color */
  color: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem; /* Space below the header */
}

.content {
  display: flex;
  flex-direction: row;
  gap: 1rem; /* Space between columns */
}

.left-column, .right-column {
  flex: 1;
  background: #fff; /* Background for content areas */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Shadow for each column */
}

/* Style for individual sections */
.section {
  margin-bottom: 1rem; /* Space between sections */
  padding: 1rem; /* Padding within sections */
  background: #f9f9f9; /* Slightly off-white background to distinguish sections */
  border: 1px solid #e0e0e0; /* Subtle border for delineation */
  border-radius: 8px; /* Rounded corners */
}

.schedule-item {
  margin-bottom: 20px;
}

.days-table {
  margin-top: 10px;
  border-collapse: collapse;
}

.days-table th, .days-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 5px;
}

.days-table th {
  background-color: #f0f0f0;
}

/* Responsiveness */
@media (max-width: 992px) { /* Medium devices (tablets, 768px and up) */
  .content {
    flex-direction: column;
  }
}

@media (max-width: 768px) { /* Small devices (landscape phones, less than 768px) */
  .dashboard {
    max-width: 100%;
    padding: 0.5rem;
  }

  .left-column, .right-column {
    /* Adjust flex-basis if you want non-equal widths for left and right columns */
    flex-basis: 100%;
  }
}
</style>
