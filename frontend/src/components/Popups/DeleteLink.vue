<template>
	<div class="information">
		<h2>Link Deletion</h2>
		<p>Are you sure you want to delete the selected links?</p>
		<div class="buttons">
			<FormKit type="button" label="Yes" button-type="danger" @click="deleteLink" />
			<FormKit type="button" label="No" button-type="secondary" @click="close" />
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
			title: "",
		};
	},
	methods: {
		async deleteLink() {
			const ids = this.data;
			const response = await this.links.delete({
				ids,
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
		close() {
			this.popups.closeSelf(this);
		},
	},
	mounted() {
		if (this.data.length > 1) {
			this.title = "selected links";
		} else {
			this.title = "link ";
		}
	},
};
</script>
