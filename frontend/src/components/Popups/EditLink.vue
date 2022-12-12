<template>
	<div class="editLink">
		<h2>Edit link</h2>
		<FormKit type="form" @submit="update" :actions="false">
			<table>
				<tr>
					<td><strong>Destination URL</strong></td>
					<td>
						<FormKit type="text" v-model="data.destination" />
					</td>
				</tr>
				<tr>
					<td><strong>Custom Slug</strong></td>
					<td>
						<FormKit type="text" v-model="data.slug" />
					</td>
				</tr>
			</table>
			<FormKit type="submit" label="Update Link" primary></FormKit>
		</FormKit>
	</div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
export default {
	props: ["data"],
	methods: {
		async update() {
			const account = useAccountStore();
			const response = await account.fetch("/link", {
				method: "PATCH",
				body: JSON.stringify({
					slug: this.data.slug,
					destination: this.data.destination,
					id: this.data.id,
				}),
			});

			if (response.useAccountStore) {
				this.links[index] = response.result;
			}
		},
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
}
</style>
