<template>
	<div class="sidebar">
		<div class="upperIcons">
			<router-link to="/dash/overview">
				<font-awesome-icon icon="list" />
				<p>Overview</p>
			</router-link>
			<router-link to="/dash/settings">
				<font-awesome-icon icon="gear" />
				<p>Settings</p>
			</router-link>
		</div>
		<div class="lowerIcons">
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
	box-sizing: border-box;
	height: 100vh;
	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
	justify-content: space-between;
	.upperIcons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
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
	}
	.spacer {
		flex-grow: 1;
	}

	@media screen and (max-width: 768px) {
		flex-direction: row;
		width: 100%;
		height: max-content;
		align-items: center;
		padding: 1rem 1.5rem 1rem;
		a {
			height: max-content;
			p {
				display: none;
			}
		}
		.upperIcons > a {
			svg {
				font-size: 1.3rem;
			}
		}
		.upperIcons,
		.lowerIcons {
			display: flex;
			flex-direction: row;
		}
	}
}
</style>
