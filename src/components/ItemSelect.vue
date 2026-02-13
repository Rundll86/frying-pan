<script setup lang="ts">
const props = defineProps<{
    items: Record<string, unknown>
}>();
const currentItem = defineModel<string | null>({ default: null });
const opening = defineModel<boolean>("opening", { default: false });

function select(key: string) {
    if (currentItem.value === key) {
        currentItem.value = null;
    } else {
        currentItem.value = key;
    }
}
function toggleOpen() {
    opening.value = !opening.value;
}
</script>
<template>
    <div class="selector" @click="toggleOpen()">
        <div class="desk">{{ currentItem || "-" }}</div>
        <div class="items" v-if="opening">
            <div class="item" v-for="_, key in items" @click="select(key)">{{ key }}</div>
        </div>
    </div>
</template>
<style scoped>
.selector {
    margin: 0 5px;
    border: 1px solid gray;
    border-radius: 5px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.05);
}

.items {
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}

.item,
.desk {
    padding: 4px 8px;
}

.item:hover,
.desk:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>