<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      NPR News Dictation
      <v-btn @click="refreshWindow()">
        <v-icon icon="mdi-refresh" />
      </v-btn>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
function refreshWindow() {
  window.location.reload()
}
</script>
