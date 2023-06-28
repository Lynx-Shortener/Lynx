<template>
	<div class="link">
		<img src="/loader.svg" alt="" v-if="loading" />
		<div class="error" v-else>
			<h1>404</h1>
			<p>Page not found</p>
		</div>
	</div>
</template>

<script>
import { useAbout } from "../stores/about";
export default {
	data() {
		return {
			loading: true,
			about: useAbout(),
		};
	},
	async mounted() {
		let slug = this.$route.params.pathMatch.join("/")
		const response = await fetch(
			"/api/link?" +
				new URLSearchParams({
					slug,
				}),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		if (data.success) {
			window.location.href = data.result.destination;
		} else {
			this.loading = false;
		}
	},
};
</script>

<style lang="scss">
.link {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	// background: var(--bg-color-4);
	.error {
		text-align: center;
		h1 {
			font-size: 5rem;
			line-height: 1.5;
			font-weight: 800;
			background: linear-gradient(to bottom, var(--color-1), transparent);
			background-clip: text;
                        -webkit-background-clip: text;
			color: transparent;
		}
		p {
			font-weight: 500;
			font-size: 2.5rem;
		}
	}
}
</style>
