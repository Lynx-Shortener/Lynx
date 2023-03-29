<template>
	<div class="editLink">
		<h2>Edit link</h2>
		<FormKit type="form" @submit="update" :actions="false">
			<table>
				<tr>
					<td><strong>Destination URL</strong></td>
					<td>
						<FormKit type="text" v-model="link.destination" />
					</td>
				</tr>
				<tr>
					<td><strong>Custom Slug</strong></td>
					<td>
						<FormKit type="text" v-model="link.slug" />
					</td>
				</tr>
			</table>
			<FormKit type="submit" label="Update Link" primary></FormKit>
		</FormKit>
	</div>
</template>

<script>
import { usePopups } from "../../stores/popups";
import { useLinks } from "../../stores/links";
export default {
	props: ["data"],
	data() {
		return {
			links: useLinks(),
			popups: usePopups(),
			link: {
				destination: "",
				slug: "",
			},
		};
	},
	methods: {
		async update() {
			const response = await this.links.update(this.link);
			if (!response.success) {
				this.popups.addPopup("Information", {
					title: "Error updating your link",
					description: response.message,
					buttons: [
						{
							name: "Retry",
							type: "primary",
							action: "return",
						},
						{
							name: "Cancel",
							type: "secondary",
							action: "close-all",
						},
					],
				});
			} else {
				this.popups.closeSelf(this);
				this.popups.addPopup("Information", {
					title: "Successfully updated your link",
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
	async mounted() {
		let link = await this.links.get(this.data.id);
		if (!link) {
			this.popups.closeSelf(this);
			this.popups.addPopup("Information", {
				title: "Error updating your link",
				description: "Link not found",
				buttons: [
					{
						name: "Okay",
						type: "primary",
						action: "close-all",
					},
				],
			});
		} else {
			this.link = link;
		}
	},
};
</script>

<style lang="scss" scoped>
.editLink {
	> h2 {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}
	:deep(.formkit-form) {
		table {
			margin-bottom: 1rem;
			border-spacing: 5px;
			tr {
				td:nth-of-type(1) {
					text-align: left;
					padding-right: 0.8rem;
					line-height: 1.4;
					white-space: nowrap;
				}
				td:nth-of-type(2) {
					width: 100%;
				}
			}
		}
	}
	@media screen and (max-width: 768px) {
		:deep(.formkit-form) {
			table {
				width: 100%;
				tr {
					td {
						display: block;
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
