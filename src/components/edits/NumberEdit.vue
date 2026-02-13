<script setup lang="ts">
import LineEdit from '../LineEdit.vue';

const modelValue = defineModel<number>();
</script>
<template>
    <LineEdit class="number-edit" type="number" :model-value="String(modelValue)"
        @update:model-value="modelValue = Number($event)" />
</template>
<style scoped>
.number-edit {
    width: 100px;
}
</style>