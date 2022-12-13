import { defineStore } from "pinia";
import { useAccountStore } from "./account";

export const useLinks = defineStore("links", {
	state: () => {
		return {
			links: [],
			sort: "desc",
			remainingPages: 1,
			pagesize: 2,
			page: 0,
		};
	},
	actions: {
		async paginate() {
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

			return;
		},
		async create({ slug, destination }) {
			const account = useAccountStore();
			const response = await account.fetch("/link", {
				method: "POST",
				body: JSON.stringify({ slug, destination }),
			});

			if (!response.success) return response;

			let link = response.result;

			link.creationDate = new Date(link.creationDate).toLocaleString();

			link.link = `${window.location.origin}/${response.result.slug}`;

			if (this.sort == "desc") {
				this.links.unshift(link);
				this.current++;
			} else {
				this.links.push(link);
			}

			return {
				success: true,
				result: { link },
			};
		},
		async get(id) {
			const index = this.links.findIndex((link) => link.id === id);
			return this.links[index];
		},
		async update({ id, slug, destination }) {
			const account = useAccountStore();
			const response = await account.fetch("/link", {
				method: "PATCH",
				body: JSON.stringify({
					id,
					slug,
					destination,
				}),
			});

			const index = this.links.findIndex((link) => link.id === id);
			let link = response.result;

			link.creationDate = new Date(link.creationDate).toLocaleString();

			link.link = `${window.location.origin}/${response.result.slug}`;

			this.links[index] = link;

			return response;
		},
	},
});
