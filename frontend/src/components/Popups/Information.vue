<template>
	<div class="information">
		<h2>{{ data.title }}</h2>
		<p v-html="data.description"></p>
		<div class="buttons">
			<FormKit
				type="button"
				:button-type="button.type"
				v-for="button in data.buttons"
				:key="button.name"
				:label="button.name"
				@click="action(button.action)"
			/>
		</div>
	</div>
</template>

<script>
import { usePopups } from "../../stores/popups";
export default {
	props: ["data"],
	data() {
		return {
			popups: usePopups(),
		};
	},
	methods: {
		action(action) {
			switch (action) {
				case "return":
					this.popups.closeTopmost();
					break;

				case "close-all":
					this.popups.closeAll();
					break;

				case "refresh":
					window.location.reload();
					break;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.information {
	h2 {
		font-size: 2rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}
	.buttons {
		margin-top: 1rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		:deep(.formkit-outer) {
			max-width: 60%;
		}
	}
}
</style>
