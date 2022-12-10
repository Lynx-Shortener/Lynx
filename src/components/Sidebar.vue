<template>
	<div class="sidebar">
		<div class="sidebarContent">
			<router-link to="/dash/overview">
				<font-awesome-icon icon="list" />
				<p>Overview</p>
			</router-link>
			<router-link to="/dash/settings">
				<font-awesome-icon icon="gear" />
				<p>Settings</p>
			</router-link>
			<div class="spacer"></div>
			<a>
				<font-awesome-icon icon="right-from-bracket" />
				<p>Logout</p>
			</a>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sidebar {
	background: var(--bg-color-2);
	height: 100%;
	position: relative;
	width: 12rem;
	.sidebarContent {
		position: fixed;
		width: 12rem;
		padding: 2rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-sizing: border-box;
		height: 100vh;
	}
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.4rem 0.5rem;
		border-radius: 5px;
		cursor: pointer;
	}
	.spacer {
		flex-grow: 1;
	}
}
</style>
