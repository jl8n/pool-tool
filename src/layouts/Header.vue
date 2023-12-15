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
        Pool Control
      </q-toolbar-title>

      <q-btn
        flat
        round
        icon="info"
      >
        <q-menu>
          <div class="row no-wrap q-pa-md">
            <div
              class="column"
              style="white-space: nowrap;"
            >
              <div>{{ layoutStore.easytouchVersion }}</div>
            </div>

            <div class="column items-center" />
          </div>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
