<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { CanvasInterface, CanvasClient } from '@dscvr-one/canvas-client-sdk';
import { registerCanvasWallet } from '@dscvr-one/canvas-wallet-adapter';
import { validateHostMessage } from './api/dscvr';

let canvasClient: CanvasClient | undefined;
const isReady = ref(false);
const user = ref<CanvasInterface.Lifecycle.User>();
const walletAddress = ref<string>('');
const isConnected = ref(false);

const connectWallet = async () => {
  if (!canvasClient) return;
  try {
    const response = await canvasClient.connectWallet('solana:101');
    const isValidResponse = await validateHostMessage(response);
    if (!isValidResponse) {
      console.error('Invalid host message');
      return;
    }
    if (response.untrusted.success) {
      walletAddress.value = response.untrusted.address;
      isConnected.value = true;
    } else {
      console.error('Failed to connect wallet:', response.untrusted.error);
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
};

const disconnectWallet = () => {
  walletAddress.value = '';
  isConnected.value = false;
};

const start = async () => {
  if (!canvasClient) return;
  const response = await canvasClient.ready();
  isReady.value = canvasClient.isReady;
  const isValidResponse = await validateHostMessage(response);
  if (!isValidResponse) return;
  if (response) {
    user.value = response.untrusted.user;
  }
};

onMounted(() => {
  canvasClient = new CanvasClient();
  registerCanvasWallet(canvasClient);
  start();
});

onUnmounted(() => {
  if (canvasClient) {
    canvasClient.destroy();
  }
});
</script>

<template>
  <div class="container">
    <h1>DSCVR Canvas Wallet Demo</h1>
    <p v-if="!isReady" class="text-center">Loading...</p>
    <template v-else>
      <p v-if="user">Welcome, {{ user.username }}!</p>
      <div v-if="!isConnected">
        <button @click="connectWallet" class="connect-btn">Connect Wallet</button>
      </div>
      <div v-else>
        <p>Wallet Address: {{ walletAddress }}</p>
        <button @click="disconnectWallet" class="disconnect-btn">Disconnect Wallet</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
}

.connect-btn {
  background-color: #4CAF50;
  color: white;
}

.disconnect-btn {
  background-color: #f44336;
  color: white;
}
</style>