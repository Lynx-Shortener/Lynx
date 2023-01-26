<template>
	<div class="pageWrapper" :demo="config.data.demo">
		<div class="demoBanner" v-if="config.data.demo">
			<p>This is a demo instance, features are limited and links will be deleted after 10 minutes.</p>
		</div>
		<router-view> </router-view>
	</div>
</template>

<script>
import { useDarkMode } from "./stores/dark";
import { useConfig } from "./stores/config";
export default {
	data() {
		return {
			config: useConfig(),
		};
	},
	mounted() {
		useDarkMode();
		this.config.load();
	},
};
</script>

<!-- <script setup>
import { storeToRefs } from "pinia";
import { useDarkMode } from "./stores/dark";
import { useConfig } from "./stores/config";
useDarkMode();
const config = useConfig();
const { data } = storeToRefs(config);
</script> -->

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
		overflow: hidden;
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
			height: 100%;
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
