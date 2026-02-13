<script setup lang="ts">
import ItemSelect from './ItemSelect.vue';

const platform = defineModel<string>();
</script>
<template>
    <div class="select-platform">
        选择调试平台：
        <ItemSelect :items="{
            turbowarp: 'https://turbowarp.org/editor',
            gandi: 'https://ccw.site/gandi/extension'
        }" v-model="platform" />
    </div>
</template>
<style scoped>
.select-platform {
    display: flex;
    align-items: center;
}
</style>