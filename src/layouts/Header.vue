<script setup lang="ts">
import { useLayoutStore } from 'src/stores/layout-store'

const layoutStore = useLayoutStore()
</script>

<template>
  <q-header
    elevated
    class="bg-primary text-white"
    height-hint="50"
  >
    <q-toolbar>
      <q-btn
        dense
        flat
        round
        icon="menu"
        @click="layoutStore.toggleDrawer()"
      />

      <q-toolbar-title>
        <router-link
          to="/"
          class="title"
        >
          Pool Control
        </router-link>
      </q-toolbar-title>

      <q-btn
        flat
        round
        icon="info"
        to="/info"
      />
    </q-toolbar>
  </q-header>
</template>

<style scoped lang="scss">
.title {
  text-decoration: none;

  &:visited {
    color: #FFFFFF;
  }
}
</style>
