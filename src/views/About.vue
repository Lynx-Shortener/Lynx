<template>
	<div class="home">
		<h1>About This Template</h1>
		<p>I made this template as this is what most of my projects start off as and it gets very tedious to repeat the same setup every time I create a new project.</p>
		<router-link to="/">Home</router-link>
	</div>
</template>

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
	p {
		margin-top: 2rem;
	}
	a {
		margin-top: 1rem;
		font-size: 1.2rem;
	}
}
</style>
