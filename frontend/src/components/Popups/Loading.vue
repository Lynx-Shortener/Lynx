<template>
    <div class="loading">
        <img :src="`/loader${!dark.dark ? '-dark' : ''}.svg`" alt="">
    </div>
</template>

<script>
import { useDarkMode } from "../../stores/dark";

export default {
    data() {
        return {
            dark: useDarkMode(),
        };
    },
};
</script>
