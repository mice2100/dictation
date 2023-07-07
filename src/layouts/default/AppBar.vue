<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      NPR News Dictation
      <v-btn id="installApp">
        <v-icon icon="mdi-dots-vertical" />
      </v-btn>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
//
import { onBeforeMount } from 'vue'
let deferredPrompt: any = null;

console.log('Appbar.vue');
onBeforeMount(() => {
  console.log('Appbar.vue onBeforeMounted');
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt fired');
    deferredPrompt = e;
  });

  const installApp = document.getElementById('installApp');
  installApp?.addEventListener('click', async () => {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt = null;
      }
    }
  });
});
</script>
