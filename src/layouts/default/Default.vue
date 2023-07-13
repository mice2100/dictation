<template>
  <v-app>
    <default-bar />

    <default-view />
    <Copyright />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import Copyright from '@/components/Copyright.vue'
</script>
