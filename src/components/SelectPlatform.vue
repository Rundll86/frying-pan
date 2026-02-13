<script setup lang="ts">
import platforms from '../structs/platforms';
import ItemSelect from './ItemSelect.vue';

const platform = defineModel<string>();
</script>
<template>
    <div class="select-platform">
        调试平台 =
        <ItemSelect :items="platforms" v-model="platform" />
    </div>
</template>
<style scoped>
.select-platform {
    display: flex;
    align-items: center;
}
</style>