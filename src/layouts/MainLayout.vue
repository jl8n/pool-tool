<script setup lang="ts">
import LeftDrawer from 'layouts/LeftDrawer.vue'
import Header from 'layouts/Header.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <Header />
    <LeftDrawer />

    <!-- page content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
