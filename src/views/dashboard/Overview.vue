<template>
	<div class="overview">
		<div class="links">
			<div class="header">
				<p>Slug</p>
				<p>Destination</p>
			</div>
			<div class="link" v-for="link in links" :key="link.id">
				<p>{{ link.slug }}</p>
				<p class="destination">{{ link.destination }}</p>
			</div>
			<span v-observe-visibility="visibilityChanged"></span>
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
					}),
				{}
			);

			this.page++;

			this.links = this.links.concat(response.result.links);
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
		border: 1px solid var(--bg-color-3);
		border-radius: 10px;
		height: 40rem;
		overflow-y: scroll;
		// width: 100%;
		width: max-content;
		margin-top: 5rem;
		padding: 1rem 2rem;
		.header,
		.link {
			display: grid;
			grid-template-columns: minmax(5rem, 10ch) 20ch;
			gap: 1rem;
			p {
				padding: 0.2rem 0.4rem;
			}
		}
		.link {
			.destination {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow-x: hidden;
			}
		}
		p {
			padding: 0.2rem;
		}
	}
}
</style>
