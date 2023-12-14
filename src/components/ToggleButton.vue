<script setup>
import { ref } from 'vue'

// Define your props
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  endpoint: {
    type: String,
    default: ''
  }
})

const buttonState = ref(false)
const resData = ref([])

const toggleButtonState = async () => {
  buttonState.value = !buttonState.value

  try {
    const res = await fetch('http://localhost:3000/' + props.endpoint)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    resData.value = await res.json()
  } catch (error) {
    // Error handling...
  }
}
</script>

<template>
  <div
    v-cloak
    class="column q-gutter-y-md"
  >
    <q-btn
      :color="buttonState ? 'blue' : 'grey'"
      @click="toggleButtonState"
    >
      {{ props.label }}
    </q-btn>
    <div v-if="resData && resData.length">
      <p>The server sent:</p>
      <div
        v-for="item in resData"
        :key="item.id"
      >
        <q-toggle
          v-model="item.isOn"
          :label="item.name"
        />
      </div>
    </div>
  </div>
</template>
