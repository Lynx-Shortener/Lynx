<template>
    <div class="toggle" @click="toggleValue" :value="modelValue">
    </div>
</template>

<script>
export default {
    props: ["modelValue"],
    methods: {
        toggleValue() {
            this.$emit("update:modelValue", !this.modelValue);
        },
    },

};
</script>

<style lang="scss" scoped>
.toggle {
    width: 3.5rem;
    height: 2rem;
    border-radius: 1rem;
    position: relative;
    cursor: pointer;
    background-color: var(--bg-color-2);
    &::after {
        content: "";
        width: 1.4rem;
        height: 1.4rem;
        position: absolute;
        top: 0.3rem;
        left: 0.3rem;
        border-radius: 1rem;
        transition: 250ms ease-in-out;
        background-color: white;
    }
    &[value="true"] {
        background-color: var(--accent);
        &::after {
            left: 1.8rem;
        }
    }
}
</style>
