<template>
	<div class="overview">
		<div class="links">
			<table>
				<thead class="header">
					<th>Created At</th>
					<th>Slug</th>
					<th>Destination</th>
				</thead>
				<tr class="link" v-for="link in links" :key="link.id">
					<td>{{ link.creationDate }}</td>
					<td>{{ link.slug }}</td>
					<td class="destination">{{ link.destination }}</td>
				</tr>
				<span v-observe-visibility="visibilityChanged"></span>
			</table>
		</div>
	</div>
</template>

<script>
import { useAccountStore } from "@/stores/account";
export default {
	data() {
		return {
			links: [],
			page: 0,
			pagesize: 5,
			endVisible: true,
			loadingMore: false,
			remainingPages: 1,
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

			console.log(links);

			this.links = this.links.concat(links);
			this.remainingPages = response.result.remaining;
			this.loadingMore = false;

			if (this.endVisible && this.remainingPages > 0) {
				this.loadMore();
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
	width: 100%;
	.links {
		height: 40rem;
		overflow-y: scroll;
		border: 1px solid var(--bg-color-3);
		border-radius: 10px;
		width: 80%;
		padding: 1rem 2rem;
		margin: 5rem auto 0;
		table {
			width: 100%;
			border-collapse: collapse;
			caption-side: bottom;
			thead,
			tr {
				td,
				th {
					padding: 0.8rem 0.4rem;
					text-align: left;
				}
			}
		}
	}
	// .links {
	// 	border: 1px solid var(--bg-color-3);
	// 	border-radius: 10px;
	// 	height: 40rem;
	// 	overflow-y: scroll;
	// 	width: 80%;
	// 	// width: max-content;
	// 	box-sizing: border-box;
	// 	margin-top: 5rem;
	// 	padding: 1rem 2rem;
	// 	margin: 5rem auto 0 auto;
	// 	border-collapse: collapse;
	// 	caption-side: bottom;
	// 	.header,
	// 	.link {
	// 		gap: 1rem;
	// 		td,
	// 		th {
	// 			padding: 0.2rem 0.4rem;
	// 		}
	// 	}
	// 	.link {
	// 		.destination {
	// 			white-space: nowrap;
	// 			text-overflow: ellipsis;
	// 			overflow-x: hidden;
	// 		}
	// 	}
	// }
}
</style>
