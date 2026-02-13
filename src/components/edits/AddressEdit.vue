<script setup lang="ts">
import { watchEffect } from 'vue';
import NumberEdit from './NumberEdit.vue';
import TextEdit from './TextEdit.vue';
import ItemSelect from '../ItemSelect.vue';

const protocol = defineModel<string>("protocol", { default: "http" });
const host = defineModel<string>("host", { default: "127.0.0.1" });
const port = defineModel<number>("port", { default: 8000 });

const emit = defineEmits<{
    update: [address: URL]
}>();
watchEffect(() => {
    if (host.value.includes(":")) {
        try {
            const url = new URL(host.value)
            const { hostname: hn, port: po, protocol: pr } = url;
            console.log(host.value, url);
            protocol.value = pr.slice(0, -1);
            host.value = hn;
            port.value = Number(po) || 80;
        } catch {
            console.warn("url无效");
        }
    }
    emit("update", new URL(`${protocol.value}://${host.value}:${port.value}`));
});
</script>
<template>
    <span class="address-edit">
        服务器地址 =
        <ItemSelect :items="{
            http: 'http',
            https: 'https'
        }" v-model="protocol" />
        ://
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