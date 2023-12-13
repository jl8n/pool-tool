<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchVisibleFeatures, poolSetState, fetchDashboard } from '../fetches/poolFetch.ts'

const dataObjects = ref([])
const poolData = ref({ // Will hold the fetched dashboard data
  air: '',
  units: {
    name: ''
  },
  bodies: []
})

onMounted(async () => {
  try {
    poolData.value = await fetchDashboard()
    console.log('ppoldata', poolData.value)
    dataObjects.value = await fetchVisibleFeatures()
  } catch (error) {
    console.error('Error fetching data:', error.message)
    // Consider setting an error state here and displaying it in the template
  }
})

const pool = computed(() => poolData.value?.bodies.find(body => body.type.name === 'pool'))
const spa = computed(() => poolData.value?.bodies.find(body => body.type.name === 'spa'))

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
  <q-page padding>
    <div class="temperature-display">
      <div class="air-temp">Air Temp: {{ poolData?.air }}°{{ poolData?.units?.name }}</div>
      <div class="section pool" v-if="poolData && pool">
        <div class="section-header">{{ pool.name }}</div>
        <div class="temperature-current">{{ pool.setPoint }}°</div>
        <div class="temperature-info">Set Point: {{ pool.setPoint }}°{{ poolData.units.name }}</div>
        <div class="temperature-info">Heat Mode: {{ pool.heatMode.desc }}</div>
        <div class="temperature-info">Heater Status: {{ pool.heatStatus.desc }}</div>
      </div>
      <div class="section spa" v-if="poolData && spa">
        <div class="section-header">{{ spa.name }}</div>
        <div class="temperature-current">{{ spa.setPoint }}°</div>
        <div class="temperature-info">Set Point: {{ spa.setPoint }}°{{ poolData.units.name }}</div>
        <div class="temperature-info">Heat Mode: {{ spa.heatMode.desc }}</div>
        <div class="temperature-info">Heater Status: {{ spa.heatStatus.desc }}</div>
      </div>
    </div>
    <div class="q-gutter-y-md">
    <div v-for="obj in dataObjects" :key="obj.id" class="flex items-center">
      <q-icon v-if="obj.type.isLight" :name="obj.isOn ? 'lightbulb' : 'lightbulb_outline'" class="q-mr-sm"></q-icon>
      <q-toggle :label="obj.name" :model-value="obj.isOn"
        @update:model-value="newState => toggleFeature(obj, newState)"></q-toggle>
    </div>
  </div>
  </q-page>
</template>

<style scoped>
.temperature-display {
  display: flex;
  flex-direction: column;
}

.air-temp {
  padding: 8px;
  background-color: #e0e0e0;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
}

.section {
  border: 1px solid #ddd;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f4f4f4;
  text-align: center;
}

.section-header {
  font-weight: bold;
  margin-bottom: 4px;
}

.temperature-current {
  font-size: 2em;
  font-weight: bold;
  margin: 4px 0;
}

.temperature-info {
  margin: 4px 0;
}
</style>
