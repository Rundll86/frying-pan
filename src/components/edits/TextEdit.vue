<script setup lang="ts">
import LineEdit from '../LineEdit.vue';

const modelValue = defineModel<string>();
</script>
<template>
    <LineEdit type="text" :model-value="String(modelValue)" @update:model-value="modelValue = String($event)" />
</template>