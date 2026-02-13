<script setup lang="ts">
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>
<template>
    <button :disabled="disabled" class="wide-btn" :class="{ disabled }">
        <slot></slot>
        <div class="hover"></div>
    </button>
</template>
<style scoped>
.hover {
    z-index: -1;
    border: 3px solid black;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    opacity: 0;
    width: calc(100% + 100px);
    height: calc(100% + 100px);
    transition: all .2s ease-out;
    pointer-events: none;
    clip-path: polygon(0 0, 10px 0, 50% 50%, calc(100% - 10px) 0, 100% 0, 100% 10px, 50% 50%, 100% calc(100% - 10px), 100% 100%, calc(100% - 10px) 100%, 50% 50%, 10px 100%, 0 100%, 0 calc(100% - 10px), 50% 50%, 0 10px);
}

.wide-btn:not(.disabled):hover .hover {
    opacity: 1;
    width: calc(100% + 30px);
    height: calc(100% + 30px);
}

.wide-btn:not(.disabled):active .hover {
    width: 100%;
    height: 100%;
}

.wide-btn {
    margin-top: 20px;
    font-size: 20px;
    color: white;
    font-weight: bold;
    padding-left: 20px;
    animation: rolldown infinite 1s linear;
    position: relative;
    height: 45px;
}

.wide-btn.disabled::after,
.wide-btn.disabled {
    animation: none;
    background-color: gray;
}

.wide-btn.disabled::before {
    display: none;
}


.wide-btn::after {
    content: "";
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 45px;
    height: 45px;
    animation: rolldown infinite 1s linear;
    z-index: -1;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    background-color: black;
}

.wide-btn::before {
    --t: translate(-50%, -50%);
    content: "";
    position: absolute;
    left: calc(100% + calc(45px / sqrt(2)));
    top: 50%;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    animation: jumpscare infinite 0.3s ease-out, rolldown infinite 2s linear;
    z-index: -1;
    filter: hue-rotate(180deg);
}

@keyframes jumpscare {
    0% {
        transform: var(--t) scale(1);
        opacity: 1;
    }

    100% {
        transform: var(--t) scale(2);
        opacity: 0;
    }
}

@keyframes rolldown {
    0% {
        background-color: red;
    }

    14.3% {
        background-color: orange;
    }

    28.6% {
        background-color: yellow;
    }

    42.9% {
        background-color: green;
    }

    57.2% {
        background-color: cyan;
    }

    71.5% {
        background-color: blue;
    }

    85.8% {
        background-color: purple;
    }

    100% {
        background-color: red;
    }
}
</style>