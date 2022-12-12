<template>
	<div class="overview">
		<div class="createLink">
			<div class="header">
				<h2>Create a new link</h2>
			</div>
			<div class="content">
				<FormKit type="form" submit-label="Create Link" @submit="createLink" :actions="false">
					<FormKit
						type="url"
						label="Destination URL"
						placeholder="https://www.example.com..."
						validation="trim:url"
						v-model="newLink.data.destination"
					/>
					<FormKit type="text" label="Custom Slug" placeholder="shopping-list" v-model="newLink.data.slug" />
					<FormKit type="submit" label="Create Link" primary></FormKit>
				</FormKit>
			</div>
		</div>
		<div class="newLink" v-if="newLink.response.link">
			<div class="content">
				<h3>Your new link has been created!</h3>
				<p
					>Your short link is
					<a :href="newLink.response.link" target="_blank"
						><span>{{ newLink.response.link }}</span></a
					></p
				>
			</div>
		</div>
		<div class="links">
			<div class="header">
				<h2>Existing Links</h2>
			</div>
			<div class="content">
				<table>
					<thead>
						<th>Created At</th>
						<th>Slug</th>
						<th>Destination</th>
					</thead>
					<tr class="link" v-for="link in links" :key="link.id">
						<td class="date"><strong>Created:&nbsp;</strong>{{ link.creationDate }}</td>
						<td class="slug"
							><strong>Slug:&nbsp;</strong>
							<span :contenteditable="link.editing">{{ link.editing ? link.edit.slug : link.slug }}</span>
						</td>
						<td class="destination"
							><strong>Destination:&nbsp;</strong>
							<span :contenteditable="link.editing">{{ link.editing ? link.edit.destination : link.destination }}</span>
						</td>
						<td class="actions">
							<FormKit type="button" :input-class="link.editing ? 'confirm' : 'edit'" @click="handleEdit(link)">
								<font-awesome-icon :icon="link.editing ? 'check' : 'pencil'" />
							</FormKit>
							<FormKit type="button" :input-class="link.editing ? 'cancel' : 'delete'" @click="handleDelete(link)">
								<font-awesome-icon :icon="link.editing ? 'x' : 'trash-can'" />
							</FormKit>
						</td>
					</tr>
					<span v-observe-visibility="visibilityChanged"></span>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
export default {
	data() {
		return {
			links: [],
			page: 0,
			pagesize: 5,
			endVisible: true,
			loadingMore: false,
			remainingPages: 1,
			newLink: {
				data: {
					slug: "",
					destination: "",
				},
				response: {},
			},
		};
	},
	methods: {
		async loadMore() {
			if (this.loadingMore) return;
			this.loadingMore = true;
			const account = useAccountStore();
			const response = await account.fetch(
				"/link/list?" +
					new URLSearchParams({
						page: this.page,
						pagesize: this.pagesize,
						sort: "desc",
					}),
				{}
			);

			this.page++;

			const links = response.result.links.map((link) => {
				link.creationDate = new Date(link.creationDate).toLocaleString();
				return link;
			});

			this.links = this.links.concat(links);
			this.remainingPages = response.result.remaining;
			this.loadingMore = false;

			if (this.endVisible && this.remainingPages > 0) {
				this.loadMore();
			}
		},
		async createLink() {
			const account = useAccountStore();
			const response = await account.fetch("/link", {
				method: "POST",
				body: JSON.stringify(this.newLink.data),
			});

			this.newLink.data.slug = "";
			this.newLink.data.destination = "";

			response.result.link = `${window.location.origin}/${response.result.slug}`;
			this.newLink.response = response.result;
		},
		async handleEdit(targetLink) {
			const index = this.links.findIndex((link) => link.id === targetLink.id);
			if (!targetLink.editing) {
				this.links[index].edit = {
					slug: targetLink.slug,
					destination: targetLink.destination,
				};
				this.links[index].editing = true;
			} else {
				const account = useAccountStore();
				this.links[index].editing = false;

				const response = await account.fetch("/link", {
					method: "PATCH",
					body: JSON.stringify({
						slug: targetLink.edit.slug,
						destination: targetLink.edit.destination,
						id: targetLink.id,
					}),
				});

				if (response.useAccountStore) {
					this.links[index] = response.result;
				}
			}
		},
		handleDelete(targetLink) {
			if (targetLink.editing) {
				const index = this.links.findIndex((link) => link.id === targetLink.id);
				this.links[index].editing = false;
			} else {
				alert("DELETE");
			}
		},
		visibilityChanged(visibile) {
			this.endVisible = visibile;
			if (!this.loadingMore && visibile && this.remainingPages > 0) this.loadMore();
		},
	},
	mounted() {
		this.loadMore();
	},
};
</script>

<style lang="scss" scoped>
.overview {
	width: 80%;
	margin: 5rem auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	.createLink,
	.newLink,
	.links {
		border: 1px solid var(--bg-color-3);
		border-radius: 10px;
		.header {
			border-bottom: 1px solid var(--bg-color-3);
			h2 {
				font-weight: 500;
				font-size: 1.5rem;
				text-align: left;
			}
		}

		.content,
		.header {
			padding: 1rem 2rem;
		}
	}

	.createLink {
		.content {
			:deep(.formkit-form) {
				display: grid;
				grid-template-columns: 3fr 1fr;
				gap: 0 1rem;
				.formkit-outer {
					margin-bottom: 1rem;
					&[data-family="button"] {
						grid-column: 1/3;
					}
				}
			}
		}
	}

	.newLink {
		h3 {
			font-weight: 500;
			font-size: 1.2rem;
			line-height: 1.5;
			margin-bottom: 1rem;
		}
	}

	.links {
		width: 100%;
		table {
			display: block;
			border-collapse: collapse;
			border-collapse: collapse;
			caption-side: bottom;
			width: 100%;
			table-layout: fixed;
			thead,
			tr {
				width: 100%;
				width: 100%;
				display: table-header-group;

				td,
				th {
					padding: 0.8rem 0.4rem;
					text-align: left;
					position: relative;
					vertical-align: middle;
					strong {
						display: none;
					}

					&.date {
						white-space: nowrap;
					}

					span {
						&[contenteditable="true"] {
							color: var(--color-4);
						}
					}

					&.destination {
						width: 100%;
						span {
							max-width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							position: absolute;
							top: 50%;
							left: 0;
							transform: translateY(-50%);
							box-sizing: border-box;
							width: 100%;
						}
					}

					:deep(.formkit-outer) {
						.formkit-wrapper {
							button {
								border-radius: 5px;
								padding: 0.4rem 0.8rem;
								background: var(--accent);
								color: var(--accent-color);
								&.delete,
								&.cancel {
									background: var(--color-error);
								}
							}
						}
					}

					&.actions {
						display: flex;
						gap: 0.2rem;
					}
				}
			}
		}
	}

	@media screen and (max-width: 768px) {
		margin: 2rem auto;
		.createLink {
			.content {
				:deep(.formkit-form) {
					grid-template-columns: 1fr;
					.formkit-outer {
						&[data-family="button"] {
							grid-column: 1;
						}
					}
				}
			}
		}
		.links,
		.createLink {
			.header {
				padding: 1rem;
			}
		}
		.links {
			.content {
				padding: 0;

				table {
					thead {
						display: none;
					}
					tr {
						display: flex;
						flex-direction: column;
						padding: 1rem;
						box-sizing: border-box;
						text-align: left;
						border-bottom: 1px solid var(--bg-color-3);
						align-items: start;
						gap: 1rem;
						td {
							line-height: 1.5;
							padding: 0;
							strong {
								display: inline;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}
}
</style>
