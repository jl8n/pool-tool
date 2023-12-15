<script setup lang="ts">
import { useLayoutStore } from 'src/stores/layout-store'

const layoutStore = useLayoutStore()
</script>

<template>
  <q-page padding>
    Pentair {{ layoutStore.easytouchVersion }}
  </q-page>
</template>
