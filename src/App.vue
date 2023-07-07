<template>
  <router-view />
  <template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      Reload
    </button>
    <button @click="close">
      Close
    </button>
  </div>
</template>
</template>

<script lang="ts" setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegisteredSW(swUrl) {
    // eslint-disable-next-line no-console
    console.log(`Service Worker at: ${swUrl}`)
  },
})

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>
