<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
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

const currentDateTime = ref(new Date().toLocaleString())
let intervalId

const pool = computed(() => poolTemps.value?.bodies.find(body => body.type.name === 'pool'))
const spa = computed(() => poolTemps.value?.bodies.find(body => body.type.name === 'spa'))

// State to track if the drawer is open
const isDrawerOpen = ref(false)

// Toggle the state of the drawer
const toggleLeftDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
onMounted(async () => {
  try {
    poolTemps.value = await fetchDashboard()
    poolSchedules.value = await fetchSchedules()
    poolDataAll.value = await fetchAll()
    poolVisibleFeatures.value = parseVisibleFeatures(poolDataAll.value)

    intervalId = setInterval(() => {
      currentDateTime.value = new Date().toLocaleString()
    }, 1000)
  } catch (error) {
    console.error('Error fetching data:', error.message)
    // Consider setting an error state here and displaying it in the template
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
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
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ poolDataAll.model }}
        </q-toolbar-title>

        <q-space />

        <div class="text-h7">{{ currentDateTime }}</div>

        <q-space />

        <div>
          <q-icon name="check_circle" v-if="isReady" class="text-green" />
          <span v-if="isReady">Ready</span>
          <q-icon name="settings" right />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <div :class="['left-drawer', isDrawerOpen ? 'open' : '']">
      <!-- Your drawer content goes here -->
      <p>Test text inside the drawer</p>
    </div>

    <div class="content">
      <!-- Toggle button for the drawer -->
      <q-btn flat dense round @click="toggleLeftDrawer" class="toggle-drawer-btn">
        <q-icon name="menu" />
      </q-btn>
      <div class="left-column">
        <div class="temperature-display">
          <div class="air-temp">
            <i class="fas fa-sun"></i>
            Air Temp: {{ poolTemps?.air }}°{{ poolTemps?.units?.name }}
          </div>
          <div class="section pool" v-if="poolTemps && pool">
            <div class="section-header">
              <i class="fas fa-tint"></i>
              {{ pool.name }}
            </div>
            <div class="temperature-current">{{ pool.setPoint }}°</div>
            <div class="temperature-info">Set Point: {{ pool.setPoint }}°{{ poolTemps?.units?.name }}</div>
            <div class="temperature-info">Heat Mode: {{ pool.heatMode.desc }}</div>
            <div class="temperature-info">Heater Status: {{ pool.heatStatus.desc }}</div>
          </div>
          <div class="section spa" v-if="poolTemps && spa">
            <div class="section-header">
              <i class="fas fa-hot-tub"></i>
              {{ spa.name }}
            </div>
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
        <div class="section features">
          <div class="section-header">Features</div>
          <!-- Features Toggle Components -->
          <div class="q-gutter-y-md">
            {{ poolVisibleFeatures.value }}
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
  max-width: 768px;
  /* Set a max-width that works well on all devices */
  margin: 0 auto;
  /* Center the dashboard in the available space */
  padding: 1rem;
  /* Add padding around the dashboard for spacing */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Subtle shadow for depth */
}

.header {
  background-color: #009688;
  /* Example header color */
  color: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  /* Space below the header */
}

.content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  /* Space between columns */
}

.left-column,
.right-column {
  flex: 1;
  background: #fff;
  /* Background for content areas */
  border-radius: 8px;
  /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  /* Shadow for each column */
}

/* Style for individual sections */
.section {
  margin-bottom: 1rem;
  /* Space between sections */
  padding: 1rem;
  /* Padding within sections */
  background: #f9f9f9;
  /* Slightly off-white background to distinguish sections */
  border: 1px solid #e0e0e0;
  /* Subtle border for delineation */
  border-radius: 8px;
  /* Rounded corners */
}

.temperature-display {
  /* Styling for the temperature display */
}

.air-temp {
  color: #f39c12;
  font-size: 1.2em;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.air-temp i {
  margin-right: 5px;
}

.section {
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.pool {
  background-color: #eaf3fa;
  color: #3498db;
}

.spa {
  background-color: #fdf2e9;
  color: #e67e22;
}

.section-header {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.section-header i {
  margin-right: 10px;
}

.temperature-current {
  font-size: 2em;
  font-weight: bold;
  color: #2c3e50;
}

.temperature-info {
  font-size: 0.9em;
  color: #7f8c8d;
}

.schedule-item {
  margin-bottom: 20px;
}

.days-table {
  margin-top: 10px;
  border-collapse: collapse;
}

.days-table th,
.days-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 5px;
}

.days-table th {
  background-color: #f0f0f0;
}

.left-drawer {
  position: fixed;
  left: -250px; /* Hide the drawer off-screen */
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: #fff;
  overflow-y: auto;
  transition: left 0.3s ease-in-out;
  z-index: 1000;
}

.left-drawer.open {
  left: 0; /* Slide the drawer into view */
}

.toggle-drawer-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1010; /* Make sure it's above the drawer */
}

/* Responsiveness */
@media (max-width: 992px) {

  /* Medium devices (tablets, 768px and up) */
  .content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {

  /* Small devices (landscape phones, less than 768px) */
  .dashboard {
    max-width: 100%;
    padding: 0.5rem;
  }

  .left-column,
  .right-column {
    /* Adjust flex-basis if you want non-equal widths for left and right columns */
    flex-basis: 100%;
  }
}
</style>
