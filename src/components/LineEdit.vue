<script setup lang="ts">
defineProps<{
    type: "text" | "number"
}>();
const modelValue = defineModel<string>();
</script>
<template>
    <input :type="type" class="input" :value="modelValue"
        @input="modelValue = ($event.target as HTMLInputElement).value">
</template>
<style scoped>
input {
    width: 200px;
    padding: 3px 5px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}
</style>