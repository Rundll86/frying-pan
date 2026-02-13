<script setup lang="ts">
import { ref, watchEffect } from "vue";
import NumberEdit from "./NumberEdit.vue";
import TextEdit from "./TextEdit.vue";
import ItemSelect from "../ItemSelect.vue";

const protocol = ref<string>("http");
const host = ref<string>("127.0.0.1");
const port = ref<number>(8000);
const platform = ref<string>("tw");
const extension = ref<string>("exampleextension");
const versions = ref<[number, number, number]>([1, 0, 0]);

const emit = defineEmits<{
    update: [address: URL]
}>();
watchEffect(() => {
    if (host.value.includes(":")) {
        try {
            const url = new URL(host.value);
            const { hostname: hn, port: po, protocol: pr } = url;
            console.log(host.value, url);
            protocol.value = pr.slice(0, -1);
            host.value = hn;
            port.value = Number(po) || 80;
        } catch {
            console.warn("url无效");
        }
    }
    emit("update", new URL(`${protocol.value}://${host.value}:${port.value}/[${platform.value}]${extension.value}@${versions.value.join(".")}.js`));
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
        /
        [
        <ItemSelect :items="{
            tw: 'tw',
            gandi: 'gandi'
        }" v-model="platform" />
        ]
        <TextEdit v-model="extension" />
        @
        <template v-for="i in 3">
            <NumberEdit v-model="versions[i]" />.
        </template>
        js
    </span>
</template>
<style scoped>
.address-edit {
    display: flex;
    gap: 5px;
    align-items: center;
}
</style>