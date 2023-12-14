<script setup lang="ts">
import { useLayoutStore } from 'stores/layout-store'

const layoutStore = useLayoutStore()
</script>

<template>
  <q-drawer
    v-model="layoutStore.leftDrawerOpen"
    side="left"
    behavior="mobile"
    bordered
  >
    <q-list>
      <q-item>
        foo
      </q-item>
      <q-item>
        foo
      </q-item>
      <q-item>
        foo
      </q-item>
    </q-list>
  </q-drawer>
</template>
