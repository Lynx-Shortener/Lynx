<template>
	<div class="overview">
		<div class="urls">
			<div class="header">
				<p>Slug</p>
				<p>Destination</p>
			</div>
			<div class="url" v-for="url in urls" :key="url.id">
				<p>{{ url.slug }}</p>
				<p class="destination">{{ url.destination }}</p>
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
			urls: [],
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
			console.log(
				"/url/list" +
					new URLSearchParams({
						page: this.page,
						pagesize: this.pagesize,
					})
			);
			const response = await account.fetch(
				"/url/list?" +
					new URLSearchParams({
						page: this.page,
						pagesize: this.pagesize,
					}),
				{}
			);

			this.page++;

			this.urls = this.urls.concat(response.result.urls);
			this.remainingPages = response.result.remaining;
			this.loadingMore = false;

			if (this.endVisible && this.remainingPages > 0) {
				this.loadMore();
			}
		},
		visibilityChanged(visibile) {
			this.endVisible = visibile;
			console.log(visibile);
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
	.urls {
		border: 1px solid var(--bg-color-3);
		border-radius: 10px;
		height: 40rem;
		overflow-y: scroll;
		// width: 100%;
		width: max-content;
		margin-top: 5rem;
		padding: 1rem 2rem;
		.header,
		.url {
			display: grid;
			grid-template-columns: minmax(5rem, 10ch) 20ch;
			gap: 1rem;
			p {
				padding: 0.2rem 0.4rem;
			}
		}
		.url {
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
