<template>
	<div class="pageWrapper" :demo="about.data.demo">
		<div class="demoBanner" v-if="about.data.demo">
			<p>This is a demo instance, features are limited and links will be deleted after 10 minutes.</p>
		</div>
		<router-view> </router-view>
	</div>
</template>

<script>
import { useDarkMode } from "./stores/dark";
import { useAbout } from "./stores/about";
export default {
	data() {
		return {
			about: useAbout(),
		};
	},
	async mounted() {
		useDarkMode();
		const about = await this.about.load();
		if (about.umami !== false) {
			const script = document.createElement("script");
			script.setAttribute("async", "");
			script.src = about.umami.url;
			script.setAttribute("data-website-id", about.umami.site);

			document.head.appendChild(script);
		}
	},
};
</script>

<style lang="scss">
body {
	background: var(--bg-color-1);
	height: 100%;
}
#app {
	color: var(--color-1);
	text-align: center;
	height: 100%;
	.pageWrapper {
		display: flex;
		box-sizing: border-box;
		gap: 4rem;
		height: 100%;
		.demoBanner {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			padding: 1rem;
			color: white;
			box-sizing: border-box;
			p {
				background: var(--accent);
				border-radius: 10px;
				padding: 1rem 0.5rem;
				font-size: 0.8rem;
			}
		}
		main {
			overflow-y: scroll;
		}
		&[demo="true"] {
			margin-top: 5rem;
		}
	}
	@media screen and (max-width: 768px) {
		.pageWrapper {
			flex-direction: column;
			gap: 0;
			.demoBanner {
				padding: 0;
				display: block;
				position: static;
				p {
					border-radius: 0;
				}
			}
			&[demo="true"] {
				margin: 0;
			}
		}
	}
}
</style>
