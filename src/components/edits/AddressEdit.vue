<script setup lang="ts">
import { watchEffect } from 'vue';
import NumberEdit from './NumberEdit.vue';
import TextEdit from './TextEdit.vue';

const host = defineModel<string>("host", { default: "127.0.0.1" });
const port = defineModel<number>("port", { default: 8000 });

const emit = defineEmits<{
    update: [address: `${string}:${number}`]
}>();
watchEffect(() => {
    if (host.value.includes(":")) {
        const [newHost, newPort] = host.value.split(":");
        host.value = newHost;
        port.value = Number(newPort);
    }
    emit("update", `${host.value}:${port.value}`);
});
</script>
<template>
    <span class="address-edit">
        服务器地址 =
        <TextEdit v-model="host" />
        :
        <NumberEdit v-model="port" />
    </span>
</template>
<style scoped>
.address-edit {
    display: flex;
    gap: 5px;
    align-items: center;
}
</style>