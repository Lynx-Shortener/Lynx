<template>
	<div class="information">
		<h2>Deleting a Link</h2>
		<p
			>Are you sure you want to delete the link <span>{{ data.slug }}</span
			>?</p
		>
		<div class="buttons">
			<FormKit type="button" label="Yes" button-type="danger" @click="deleteLink" />
			<FormKit type="button" label="No" button-type="secondary" />
		</div>
	</div>
</template>

<script>
import { usePopups } from "../../stores/popups";
import { useLinks } from "../../stores/links";
export default {
	props: ["data"],
	data() {
		return {
			popups: usePopups(),
			links: useLinks(),
		};
	},
	methods: {
		async deleteLink() {
			const { id } = this.data;
			const response = await this.links.delete({
				id,
			});

			if (!response.success) {
				this.popups.addPopup("Information", {
					title: "Error deleting your link",
					description: "Please try again later",
					buttons: [
						{
							name: "Okay",
							type: "primary",
							action: "close-all",
						},
					],
				});
			} else {
				this.popups.closeSelf(this);
				this.popups.addPopup("Information", {
					title: "Successfully deleted your link",
					buttons: [
						{
							name: "Okay",
							type: "primary",
							action: "close-all",
						},
					],
				});
			}
		},
	},
};
</script>
