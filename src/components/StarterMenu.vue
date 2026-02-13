<script setup lang="ts">
import { ref } from 'vue';
import AddressEdit from './edits/AddressEdit.vue';
import TitleInfo from './TitleInfo.vue';
import SelectPlatform from './SelectPlatform.vue';
import LargeButton from './LargeButton.vue';

const address = ref<string>("");
const platform = ref<string>("");

function go() { }
</script>
<template>
    <div class="starter">
        <TitleInfo />
        <AddressEdit @update="address = $event" />
        <SelectPlatform v-model="platform" />
        <LargeButton @click="go">Go!!!</LargeButton>
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