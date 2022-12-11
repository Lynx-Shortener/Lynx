<template>
	<Sidebar v-if="showSidebar" />
	<main><router-view /></main>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
export default {
	components: {
		Sidebar,
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
	overflow-y: scroll;
	padding-right: 4rem;
}
</style>
