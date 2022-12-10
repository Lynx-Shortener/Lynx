<template>
	<Sidebar v-if="showSidebar" />
	<main><router-view /></main>
</template>

<script>
import Sidebar from "../../components/Sidebar.vue";
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
	margin-right: 4rem;
	width: 100%;
}
</style>
