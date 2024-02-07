<template>
    <Sidebar v-if="showSidebar" />
    <PopupContainer />
    <main><router-view /></main>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import PopupContainer from "../components/PopupContainer.vue";

export default {
    components: {
        Sidebar,
        PopupContainer,
    },
    computed: {
        showSidebar() {
            return !this.$route.meta.hideSidebar;
        },
    },
};
</script>

<style lang="scss" scoped>
main {
    width: 100%;
    box-sizing: border-box;
    @media screen and (max-width: 768px) {
        padding-right: 0;
    }
}
</style>
