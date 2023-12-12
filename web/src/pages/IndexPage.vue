<script setup>
import { ref } from 'vue'
import { fetchVisibleFeatures, poolSetState } from '../fetches/poolFetch.ts'
// import { fetchVisibleFeatures } from 'web/src/fetches/poolFetch.ts'
const dataObjects = ref([])

const fetchData = async () => {
  try {
    dataObjects.value = await fetchVisibleFeatures()
  } catch (error) {
    console.error('Error updating state:', error.message)
  }
}

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

fetchData()
</script>

<template>
  <div class="q-gutter-y-md">
    <div v-for="obj in dataObjects" :key="obj.id" class="flex items-center">
      <q-icon v-if="obj.type.isLight" :name="obj.isOn ? 'lightbulb' : 'lightbulb_outline'" class="q-mr-sm"></q-icon>
      <q-toggle :label="obj.name" :model-value="obj.isOn"
        @update:model-value="newState => toggleFeature(obj, newState)"></q-toggle>
    </div>
  </div>
</template>
