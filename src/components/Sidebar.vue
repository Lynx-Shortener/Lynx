<template>
	<div class="sidebar">
		<router-link to="/dash/overview">
			<font-awesome-icon icon="list" />
			<p>Overview</p>
		</router-link>
		<router-link to="/dash/settings">
			<font-awesome-icon icon="gear" />
			<p>Settings</p>
		</router-link>
		<div class="spacer"></div>
		<div class="lowericons">
			<a @click="darkMode.toggle()" class="darkmode">
				<font-awesome-icon :icon="darkMode.dark ? 'sun' : 'moon'" />
				<p>{{ darkMode.dark ? "Light Mode" : "Dark Mode" }}</p>
			</a>
			<a class="logout">
				<font-awesome-icon icon="right-from-bracket" />
				<p>Logout</p>
			</a>
		</div>
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
.sidebar {
	background: var(--bg-color-2);
	height: 100%;
	position: relative;
	width: max-content;
	padding: 1.5rem 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	box-sizing: border-box;
	height: 100vh;
	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.4rem 0.5rem;
		border-radius: 2px;
		cursor: pointer;
		white-space: nowrap;
		&.router-link-exact-active {
			background: var(--accent);
			color: var(--accent-color);
		}
		&.logout,
		&.darkmode {
			svg {
				background: var(--accent);
				padding: 10px;
				border-radius: 50%;
				color: var(--accent-color);
				aspect-ratio: 1/1;
			}
		}
		// &:hover {
		// 	background: ;
		// }
	}
	.spacer {
		flex-grow: 1;
	}
}
</style>
