<template>
	<div class="overview">
		<div class="header">
			<div class="title">
				<h1>Lynx</h1>
			</div>
			<div class="actions">
				<div class="icon refresh">
					<font-awesome-icon icon="arrows-rotate" :spinning="refreshSpinning" ref="refreshButton" @click="refresh" />
				</div>
				<div class="custom search" @click.self="$refs.searchbox.focus()">
					<input type="text" v-model="search.value" placeholder="Search" ref="searchbox" />
					<font-awesome-icon icon="magnifying-glass" @click="$refs.searchbox.focus()" />
				</div>
				<button @click="importLinks">
					<font-awesome-icon icon="upload" />
					<span>Import</span>
				</button>
				<button @click="exportLinks">
					<font-awesome-icon icon="download" />
					<span>Export</span>
				</button>
				<button @click="popups.addPopup('CreateLink', {})"> Add Link </button>
			</div>
		</div>
		<div class="links">
			<table>
				<thead>
					<th></th>
					<th>Author</th>
					<th>Created At</th>
					<th>Slug</th>
					<th>Destination</th>
					<th>Visits</th>
					<th></th>
				</thead>
				<tr class="link" v-for="link in links.links" :key="link.id">
					<td>
						<div class="checkbox" @click="toggleSelection(link)" :selected="selectedLinks.includes(link.id)">
							<font-awesome-icon icon="check" v-if="selectedLinks.includes(link.id)" />
						</div>
					</td>
					<td class="author">
						<strong>Author:&nbsp;</strong> <span>{{ link.account }}</span></td
					>
					<td class="date"><strong>Created:&nbsp;</strong>{{ link.creationDate }}</td>
					<td class="slug"
						><strong>Slug:&nbsp;</strong>
						<span>
							<a :href="`/${link.slug}`" target="_blank">{{ link.slug }}</a></span
						>
					</td>
					<td class="destination"
						><strong>Destination:&nbsp;</strong>
						<span>{{ link.destination }}</span>
					</td>
					<td>
						<strong>Visits:&nbsp;</strong>
						<span>{{ link.visits }} </span>
					</td>
					<td @click="showContextMenu($event, link)" class="menu">
						<font-awesome-icon icon="ellipsis-vertical" />
					</td>
					<td class="buttons">
						<button @click="handleEdit(link)">
							<font-awesome-icon icon="pencil" />
							<span>Edit</span>
						</button>
						<button @click="handleDelete([link.id])">
							<font-awesome-icon icon="trash-can" />
							<span>Delete</span>
						</button>
					</td>
				</tr>
				<div class="bulkManagement" v-if="selectedLinks.length > 0">
					<button @click="handleDelete(selectedLinks)">
						<font-awesome-icon icon="trash-can" />
						Delete Selected Links
					</button>
				</div>
			</table>
			<p class="empty" v-observe-visibility="visibilityChanged">{{
				links.remainingPages === 0 && links.links.length === 0
					? search.value
						? "No links match that search"
						: "No links have currently been added."
					: ""
			}}</p>
		</div>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
			<!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
			<symbol id="icon-trash-can" viewBox="0 0 448 512">
				<path
					fill="currentColor"
					d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
				/>
			</symbol>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
			<symbol id="icon-pencil" viewBox="0 0 512 512">
				<path
					fill="currentColor"
					d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
				/>
			</symbol>
		</svg>
	</div>
</template>

<script>
import { usePopups } from "../../stores/popups";
import { useLinks } from "../../stores/links";
import ContextMenu from "@imengyu/vue3-context-menu";
export default {
	data() {
		return {
			popups: usePopups(),
			links: useLinks(),
			endVisible: true,
			loadingMore: false,
			selectedLinks: [],
			search: {
				timeout: null,
				value: "",
			},
			refreshSpinning: true,
		};
	},
	methods: {
		async loadMore() {
			if (this.loadingMore) return;
			this.loadingMore = true;
			this.refreshSpinning = true;
			await this.links.paginate({ search: this.search.value });
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
		handleDelete(links) {
			this.popups.addPopup("DeleteLink", links);
			this.selectedLinks = [];
		},
		importLinks() {
			this.popups.addPopup("Import-Service");
		},
		exportLinks() {
			this.popups.addPopup("Export");
		},
		visibilityChanged(visible) {
			this.endVisible = visible;
			if (!this.loadingMore && visible && this.links.remainingPages > 0) this.loadMore();
		},
		toggleSelection(link) {
			if (this.selectedLinks.includes(link.id)) {
				this.selectedLinks = this.selectedLinks.filter((id) => id !== link.id);
			} else {
				this.selectedLinks.push(link.id);
			}
		},
		showContextMenu(e, link) {
			e.preventDefault();
			ContextMenu.showContextMenu({
				x: e.x,
				y: e.y,
				items: [
					{
						label: "Edit",
						svgIcon: "#icon-pencil",
						onClick: () => {
							this.handleEdit(link);
						},
					},
					{
						label: "Delete",
						svgIcon: "#icon-trash-can",
						onClick: () => {
							this.handleDelete([link.id]);
						},
					},
				],
			});
		},
		createSearch() {
			this.links.clear();
			this.loadMore();
		},
		refresh() {
			this.links.clear();
			this.loadMore();
		},
	},
	mounted() {
		this.loadMore();
		this.$refs.refreshButton.$el.addEventListener("animationiteration", () => {
			if (this.loadingMore === false) {
				this.refreshSpinning = false;
			}
		});
	},
	watch: {
		"search.value"(value) {
			const typingInterval = 500;
			this.refreshSpinning = true;
			clearTimeout(this.search.timeout);
			this.search.timeout = setTimeout(this.createSearch, typingInterval);
		},
	},
};
</script>

<style lang="scss" scoped>
.overview {
	margin: 3rem auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	> .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title {
			h1 {
				font-size: 3rem;
				font-weight: 500;
			}
		}
		.actions {
			display: flex;
			gap: 0.3rem;
			height: max-content;
			.icon {
				display: grid;
				place-content: center;
				padding: 0.5rem;
				> svg {
					cursor: pointer;
					color: var(--color-3);
					transition: color 250ms ease-in-out;
					&:hover {
						color: var(--color-1);
					}
					@keyframes spin {
						from {
							transform: rotate(0deg);
						}
						to {
							transform: rotate(180deg);
						}
					}
					animation: spin 1s linear infinite;
					&[spinning="false"] {
						animation: none;
					}
				}
			}
			.custom,
			button {
				display: flex;
				align-items: center;
				padding: 0.5rem 1rem;
				border-radius: 5px;
				font-family: inherit;
				cursor: pointer;
				span {
					font-weight: 400;
				}
			}
			.custom {
				border: 1px solid var(--bg-color-2);
				input {
					background: none;
					margin: 0;
					padding: 0;
					border: none;
				}
				svg {
					margin: 0;
				}

				&.search {
					padding: 0 0.5rem;
					input {
						transition: 250ms ease-in-out;
						padding: 0.5rem 0;
						color: var(--color-2);
						font: inherit;
						width: 0;
						&:focus {
							border: none;
							outline: none;
						}
						&:focus,
						&:not(:placeholder-shown) {
							width: 8rem;
						}
					}
					&:focus {
						input {
							width: 8rem;
						}
					}
				}
			}
			button {
				&:last-of-type {
					color: var(--accent-color);
					background: var(--accent);
					border: 1px solid var(--accent);
				}
				&:not(:last-of-type) {
					display: flex;
					gap: 0.5rem;
					font-weight: 300;
					background: transparent;
					border: 1px solid var(--bg-color-2);
					color: var(--color-2);
				}
			}
			:deep(.formkit-outer) {
				height: 100%;
				display: block;
				margin: 0;
				&:last-of-type {
					.formkit-wrapper {
						button {
							padding-inline: 1rem;
							white-space: nowrap;
						}
					}
				}
				&:not(:last-of-type) {
					display: block;
					height: 100%;
					aspect-ratio: 1/1;
					.formkit-wrapper {
						height: 100%;
						button {
							background: var(--bg-color-3);
							color: var(--accent-color);
							padding: 0.5rem;
							height: 100%;
							display: block;
							box-sizing: border-box;
						}
					}
				}
			}
		}
	}

	.links {
		border: none;
		table {
			border-collapse: collapse;
			caption-side: bottom;
			table-layout: auto;
			width: 100%;
			position: relative;

			thead,
			tr {
				td,
				th {
					text-align: left;
					&:first-of-type {
						width: 2rem;
						.checkbox {
							width: 1rem;
							height: 1rem;
							border-radius: 5px;
							border: 1px solid var(--bg-color-2);
							display: grid;
							place-items: center;
							cursor: pointer;
							&[selected="true"] {
								background: var(--accent);
								border: 1px solid var(--accent);
								color: var(--accent-color);
							}
						}
					}
					&.buttons {
						display: none;
					}
				}
			}
			thead {
				border-bottom: 2px solid var(--bg-color-2);
				color: var(--color-3);
				font-weight: 400;
				th {
					padding: 0.8rem 1rem;
					padding: 0.8 1rem 1rem;
					box-sizing: border-box;
					font-size: 0.8rem;
					font-weight: 600;
				}
			}
			tr {
				text-align: left;
				border-bottom: 1px solid var(--bg-color-2);
				td {
					white-space: nowrap;
					padding: 0.8rem 1rem;
					box-sizing: border-box;
					vertical-align: middle;
					font-size: 0.8rem;
					color: var(--color-2);
					font-weight: 400;
					@media screen and (min-width: 768px) {
						strong {
							display: none;
						}
					}
					position: relative;
					&.destination {
						width: 100%;
						span {
							max-width: 100%;
							overflow-x: hidden;
							text-overflow: ellipsis;
							position: absolute;
							top: 50%;
							left: 0;
							transform: translateY(-50%);
							box-sizing: border-box;
							padding: 1rem 1rem;
						}
					}
					&.menu {
						cursor: pointer;
					}
				}
			}

			.bulkManagement {
				position: fixed;
				bottom: 2rem;
				left: calc(50% + 4rem);
				transform: translateX(-50%);
				button {
					background: var(--color-error);
					border: none;
					padding: 0.5rem 1rem;
					border-radius: 5px;
					font-family: inherit;
					cursor: pointer;
					display: flex;
					align-items: center;
					gap: 0.5rem;
					color: var(--accent-color);
				}
			}
		}
		.empty {
			margin-top: 0.5rem;
		}
	}

	> svg {
		display: none;
	}

	@media screen and (max-width: 768px) {
		// margin: 2rem;
		width: 100%;
		margin: 0;
		padding: 2rem;
		box-sizing: border-box;
		> .header {
			flex-direction: column;
			gap: 1rem;
			margin-bottom: 2rem;
			.actions {
				width: 100%;
				flex-wrap: wrap;
				justify-content: space-evenly;
				gap: 0.8rem;
				.search {
					width: 100%;
					padding: 1rem;
					input {
						flex-grow: 1;
						width: 100%;
					}
				}
				.icon {
					&.refresh {
						svg {
							font-size: 1.5rem;
						}
					}
				}
				button {
					flex-grow: 1;
					justify-content: center;
					padding-block: 0.5rem;
				}
			}
		}
		.links {
			table {
				display: block;
				thead {
					display: none;
				}

				tr {
					display: block;
					td {
						display: block;
						font-size: 1rem;
						padding-inline: 0;
						&:first-of-type {
							// hide checkbox
							display: none;
						}
						&.destination {
							overflow: scroll;
							span {
								position: static;
								padding: 0;
							}
						}
						&.menu {
							display: none;
						}
						&.buttons {
							display: grid;
							grid-template-columns: 1fr 1fr;
							gap: 1rem;

							button {
								border: none;
								padding: 0.8em 1em;
								display: flex;
								gap: 1rem;
								justify-content: center;
								font-size: 1rem;
								border-radius: 5px;
								font: inherit;
								&:first-of-type {
									background-color: var(--accent);
									color: var(--accent-color);
								}
								&:last-of-type {
									background-color: var(--color-error);
									color: var(--accent-color);
								}
							}
						}
					}
				}
			}
		}
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
