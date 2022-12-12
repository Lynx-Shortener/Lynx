<template>
	<div class="popupContainer" v-show="popups.popups.length" @click.self="popups.closeTopmost">
		<div :class="['popup', popup.loaded ? 'loaded' : 'loading']" v-for="popup in popups.popups" :key="popup.id">
			<div class="exitIcon" v-if="popup.loaded" @click="popups.closePopup(popup.id)">
				<font-awesome-icon icon="x" />
			</div>
			<component :is="popup.component" @vue:mounted="popups.setLoaded(popup.id)" v-show="popup.loaded" :data="popup.data" />
			<div class="loader" v-if="!popup.loaded">
				<img src="/loader.svg" alt="" />
			</div>
		</div>
	</div>
</template>

<script>
import { usePopups } from "../stores/popups";
export default {
	data() {
		return {
			popups: usePopups(),
		};
	},
};
</script>

<style lang="scss" scoped>
.popupContainer {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(black, 0.4);
	z-index: 1;
	display: grid;
	place-items: center;
	.popup {
		background: var(--bg-color-2);
		border-radius: 10px;
		position: relative;
		padding: 1rem;
		width: 40rem;
		max-width: 90%;
		&.loaded {
			padding: 2rem 1rem 1rem;
		}
		.exitIcon {
			position: absolute;
			top: 0.8rem;
			right: 0.8rem;
			svg {
				cursor: pointer;
			}
		}
	}
}
</style>
