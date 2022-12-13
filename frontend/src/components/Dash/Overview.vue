<template>
	<div class="overview">
		<div class="createLink">
			<div class="header">
				<h2>Create a new link</h2>
			</div>
			<div class="content">
				<FormKit type="form" submit-label="Create Link" @submit="createLink" :actions="false">
					<FormKit
						type="text"
						label="Destination URL"
						placeholder="https://www.example.com..."
						validation="trim"
						v-model="newLink.data.destination"
					/>
					<FormKit type="text" label="Custom Slug" placeholder="shopping-list" v-model="newLink.data.slug" />
					<FormKit type="submit" label="Create Link" primary></FormKit>
					<div class="validation-error">
						<p>{{ newLink.data.error }}</p>
					</div>
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
					<tr class="link" v-for="link in links.links" :key="link.id">
						<td class="date"><strong>Created:&nbsp;</strong>{{ link.creationDate }}</td>
						<td class="slug"
							><strong>Slug:&nbsp;</strong>
							<span>{{ link.slug }}</span>
						</td>
						<td class="destination"
							><strong>Destination:&nbsp;</strong>
							<span>{{ link.destination }}</span>
						</td>
						<td class="actions">
							<FormKit type="button" input-class="edit" @click="handleEdit(link)">
								<font-awesome-icon icon="pencil" />
							</FormKit>
							<FormKit type="button" input-class="delete" @click="handleDelete(link)">
								<font-awesome-icon icon="trash-can" />
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
import { usePopups } from "../../stores/popups";
import { useAccountStore } from "../../stores/account";
import { useLinks } from "../../stores/links";
export default {
	data() {
		return {
			popups: usePopups(),
			links: useLinks(),
			page: 0,
			pagesize: 5,
			endVisible: true,
			loadingMore: false,
			remainingPages: 1,
			newLink: {
				data: {
					slug: "",
					destination: "",
					error: "",
				},
				response: {},
			},
		};
	},
	methods: {
		async loadMore() {
			if (this.loadingMore) return;
			this.loadingMore = true;
			await this.links.paginate();
			this.loadingMore = false;

			if (this.endVisible && this.links.remainingPages !== 0) {
				this.loadMore();
			}
		},
		async createLink() {
			this.newLink.data.error = null;
			const { slug, destination } = this.newLink.data;
			const response = await this.links.create({
				slug,
				destination,
			});

			if (response.success) {
				this.newLink.response = response.result.link;
			} else {
				this.newLink.data.error = response.message;
			}
		},
		handleEdit(link) {
			this.popups.addPopup("EditLink", { id: link.id });
		},
		handleDelete(link) {
			this.popups.addPopup("DeleteLink", link);
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
				.validation-error {
					grid-column: 1/3;
					text-align: left;
					color: var(--color-error);
					font-weight: 5old;
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
					.validation-error {
						grid-column: 1;
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

							overflow: hidden;

							&.destination {
								span {
									position: static;
									overflow: hidden;
								}
							}
							&.actions {
								width: 100%;
							}
						}
					}
				}
			}
		}
	}
}
</style>
