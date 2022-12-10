<template>
	<div class="home">
		<h1>Welcome to the Jack-Bailey Vue + Vite + vue-router + SCSS template!</h1>
		<button @click="darkMode.toggle()">Toggle Dark Mode</button>
		<router-link to="/about">About</router-link>
	</div>
</template>

<script>
import { useDarkMode } from "../stores/dark";
export default {
	data() {
		return {
			darkMode: useDarkMode(),
		};
	},
};
</script>

<style lang="scss" scoped>
.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	h1 {
		font-size: 3rem;
		font-weight: 600;
		text-align: center;
	}
	button {
		margin-top: 2rem;
		border: none;
		padding: 0.5em 1em;
		border-radius: 5px;
		background: var(--accent);
		color: var(--accent-color);
		font-size: 1.2rem;
		cursor: pointer;
		transition: 250ms ease-in-out;
		&:hover {
			transform: scale(1.05);
		}
	}
	a {
		margin-top: 1rem;
		font-size: 1.2rem;
	}
}
</style>
