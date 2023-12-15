<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { QToggle } from 'quasar'
import { useLayoutStore } from 'stores/layout-store'
import { poolSetState, fetchDashboard, fetchSchedules, fetchAll } from '../fetches/poolFetch'
import { parseVisibleFeatures } from '../fetches/poolHelper'
import type { TempBody } from 'pages/IndexPage.types'
import type { AllResponse } from 'src/types/AllResponse.types'
import type { TempsResponse } from 'src/types/TempsResponse.types'
import type { ParsedSchedule, Feature } from 'src/fetches/poolHelper.types'
// import { apiRequest } from 'src/fetches/generic'

const layoutStore = useLayoutStore()

const poolDataAll = ref<AllResponse>()
const poolSchedules = ref<ParsedSchedule[]>([])
const poolVisibleFeatures = ref<Feature[]>([])

const poolTemps = ref<TempsResponse>({ // Will hold the fetched dashboard data
  air: 0,
  units: {
    name: '',
    val: 0,
    desc: ''
  },
  bodies: [] as TempBody[]
})

const currentDateTime = ref(new Date().toLocaleString())
let intervalId: ReturnType<typeof setInterval>

const pool = computed<TempBody | undefined>(() => {
  if (poolTemps.value.bodies.length) {
    return poolTemps.value.bodies.find(
      (body: TempBody) => body.type.name === 'pool'
    )
  }
  return undefined // or null, depending on your needs
})

const spa = computed<TempBody | undefined>(() =>
  poolTemps.value.bodies.find(body => body.type.name === 'spa')
)

// State to track if the drawer is open
onMounted(async () => {
  try {
    poolTemps.value = await fetchDashboard()
    poolSchedules.value = await fetchSchedules()
    poolDataAll.value = await fetchAll()

    if (poolDataAll.value) {
      // Safe to access properties
      poolVisibleFeatures.value = parseVisibleFeatures(poolDataAll.value)
      layoutStore.easytouchVersion = poolDataAll.value.model
    } else {
      // Handle the null case, set features and version to appropriate values
    }
    intervalId = setInterval(() => {
      currentDateTime.value = new Date().toLocaleString()
    }, 1000)
  } catch (error) {
    let message = 'Unknown error'
    if (error instanceof Error) message = error.message
    console.error('Error fetching data:', message)
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const toggleFeature = async (feature: Feature, newState: boolean) => {
  try {
    // Call the poolSetState function
    await poolSetState(feature.id, newState, feature.equipmentType)

    // Update the local state to reflect the change
    feature.isOn = newState
    console.log('State updated for ID:', feature.id)
  } catch (error) {
    let message = 'Unknown error'
    if (error instanceof Error) message = error.message
    console.error('Error updating state data:', message)
  }
}
</script>

<template>
  <q-page padding>
    <div class="row space-between">
      <div class="col">
        {{ poolDataAll?.model }}
      </div>
      <div class="col text-h7 text-right">
        {{ currentDateTime }}
      </div>
    </div>

    <div>
      <!-- <q-icon
        v-if="isReady"
        name="check_circle"
        class="text-green"
      />
      <span v-if="isReady">Ready</span>
      <q-icon
        name="settings"
        right
      /> -->
    </div>
    <div class="left-column">
      <div class="temperature-display">
        <div class="air-temp">
          <i class="fas fa-sun" />
          Air Temp: {{ poolTemps?.air }}°{{ poolTemps?.units?.name }}
        </div>
        <div
          v-if="poolTemps && pool"
          class="section pool"
        >
          <div class="section-header">
            <i class="fas fa-tint" />
            {{ pool.name }}
          </div>
          <div class="temperature-current">
            {{ pool.setPoint }}°
          </div>
          <div class="temperature-info">
            Set Point: {{ pool.setPoint }}°{{ poolTemps?.units?.name }}
          </div>
          <div class="temperature-info">
            Heat Mode: {{ pool.heatMode.desc }}
          </div>
          <div class="temperature-info">
            Heater Status: {{ pool.heatStatus.desc }}
          </div>
        </div>
        <div
          v-if="poolTemps && spa"
          class="section spa"
        >
          <div class="section-header">
            <i class="fas fa-hot-tub" />
            {{ spa.name }}
          </div>
          <div class="temperature-current">
            {{ spa.setPoint }}°
          </div>
          <div class="temperature-info">
            Set Point: {{ spa.setPoint }}°{{ poolTemps?.units?.name }}
          </div>
          <div class="temperature-info">
            Heat Mode: {{ spa.heatMode.desc }}
          </div>
          <div class="temperature-info">
            Heater Status: {{ spa.heatStatus.desc }}
          </div>
        </div>
      </div>
      <!-- Pumps Section -->
      <div class="section pumps">
        <div class="section-header">
          Pumps
        </div>
        <!-- Pump Components -->
      </div>
    </div>
    <div class="right-column">
      <!-- Features Section -->
      <div class="section features">
        <div class="section-header">
          Features
        </div>
        <!-- Features Toggle Components -->
        <div class="q-gutter-y-md">
          <div
            v-for="obj in poolVisibleFeatures"
            :key="obj.id"
            class="flex items-center"
          >
            {{ obj }}
            <q-toggle
              :label="obj.name"
              :model-value="obj.isOn"
              @update:model-value="newState => toggleFeature(obj, newState)"
            />
          </div>
        </div>
      </div>
      <!-- Schedules Section -->
      <div class="section schedules">
        <div class="section-header">
          Schedules
        </div>
        <div
          v-for="schedule in poolSchedules"
          :key="schedule.id"
          class="schedule-item"
        >
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
              <td
                v-for="(day, index) in schedule.days"
                :key="index"
              >
                <span v-if="day === 1">✓</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Schedules Components -->
      </div>
    </div>
  </q-page>
</template>

<style scoped>
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

</style>
