<script setup lang="ts">
import { computed, ref } from 'vue';
import AddressEdit from './edits/AddressEdit.vue';
import TitleInfo from './TitleInfo.vue';
import SelectPlatform from './SelectPlatform.vue';
import LargeButton from './LargeButton.vue';
import platforms, { Platform } from '../structs/platforms';
import { go } from '../structs/run';

const address = ref<URL>(new URL("http://127.0.0.1:8000"));
const platform = ref<Platform>("TurboWarp");

const state = computed<{ ready: boolean; message: string; }>(() => {
    const port = Number(address.value.port);
    if (!Object.keys(platforms).includes(platform.value)) return { ready: false, message: `无效的平台“${platform.value}”` };
    if (!["https", "http"].includes(address.value.protocol.slice(0, -1))) return { ready: false, message: `无效的地址协议“${address.value.protocol}”` };
    if (port < 1 || port > 65535 || !Number.isInteger(port)) return { ready: false, message: `端口号∈[1,65535]∩Z` };
    return {
        ready: true,
        message: "",
    }
});

function startGo() {
    go(platform.value, address.value);
}
</script>
<template>
    <div class="starter">
        <TitleInfo />
        <AddressEdit @update="address = $event" />
        <SelectPlatform v-model="platform" />
        <LargeButton :disabled="!platform" @click="startGo">Go!!!</LargeButton>
        <span class="error-tip" v-if="!state.ready">{{ state.message }}</span>
    </div>
</template>
<style scoped>
.starter {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
}
</style>