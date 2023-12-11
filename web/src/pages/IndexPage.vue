<script setup>
import { ref } from 'vue'

const dataObjects = ref([])

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3000/state/visible')
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    dataObjects.value = await response.json()
  } catch (error) {
    console.error('An error occurred:', error.message)
  }
}

const toggleFeature = async (item, newState) => {
  try {
    const response = await fetch('http://localhost:3000/setState', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: item.id,
        state: newState,
        equipmentType: item.equipmentType
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

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
