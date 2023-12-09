<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string,
  endpoint: string
}>()

const buttonState = ref(false)
const resData = ref(null)

async function toggleButtonState () {
  buttonState.value = !buttonState.value

  try {
    const res = await fetch('http://localhost:3000/' + props.endpoint)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    resData.value = await res.json()
    return resData
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      console.error('Network error: Please check your internet connection.')
    } else if (error instanceof SyntaxError) {
      // Parsing error
      console.error('Parsing error: failed to parse response data.')
    } else {
      // Server error or unknown error
      console.error('An error occured:', (error as Error).message)
    }
  }
}

</script>

<template>
    <div v-cloak class="column q-gutter-y-md">
        <q-btn :color="buttonState ? 'blue' : 'grey'" @click="toggleButtonState">{{ $props.label }}</q-btn>
        <div v-if="resData">
            <p>The server sent:</p>
            <p>{{ resData }}</p>
        </div>
    </div>

</template>
