import { defineStore } from "pinia";
import { useAccountStore } from "./account";

export const useLinks = defineStore("links", {
	state: () => {
		return {
			links: [],
			sort: {
				field: "creationDate",
				type: -1,
			},
			remainingPages: 1,
			pagesize: 80,
			page: 0,
		};
	},
	actions: {
		clear() {
			this.links = [];
			this.remainingPages = 1;
			this.page = 0;
		},
		formatDate(date) {
			function ordinal_suffix_of(i) {
				var j = i % 10,
					k = i % 100;
				if (j == 1 && k != 11) {
					return i + "st";
				}
				if (j == 2 && k != 12) {
					return i + "nd";
				}
				if (j == 3 && k != 13) {
					return i + "rd";
				}
				return i + "th";
			}

			date = new Date(date);
			const day = ordinal_suffix_of(date.getDate());
			const month = date.toLocaleString("default", { month: "short" });
			const year = date.getFullYear();

			return `${month} ${day}, ${year}`;
		},
		async paginate({ search }) {
			const account = useAccountStore();
			const response = await account.fetch(
				"/link/list?" +
					new URLSearchParams({
						page: this.page,
						pagesize: this.pagesize,
						sortType: this.sort.type,
						sortField: this.sort.field,
						search,
					}),
				{}
			);

			this.page++;

			const links = response.result.links.map((link) => {
				link.creationDate = this.formatDate(link.creationDate);
				link.visits = new Intl.NumberFormat("default", {}).format(link.visits || 0);
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

			link.creationDate = this.formatDate(link.creationDate);

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

			if (!response.success) return response;

			const index = this.links.findIndex((link) => link.id === id);
			let link = response.result;

			link.creationDate = this.formatDate(link.creationDate);
			link.visits = new Intl.NumberFormat("default", {}).format(link.visits || 0);

			link.link = `${window.location.origin}/${response.result.slug}`;

			this.links[index] = link;

			return response;
		},
		async delete({ ids }) {
			const account = useAccountStore();
			const response = await account.fetch("/link", {
				method: "DELETE",
				body: JSON.stringify({
					ids,
				}),
			});

			if (!response.success) return response;

			this.links = this.links.filter((link) => !ids.includes(link.id));

			return response;
		},
		async import({ file, service }) {
			const account = useAccountStore();
			const formdata = new FormData();
			formdata.append("file", file);
			formdata.append("service", service.toLowerCase());

			const response = await account.fetch("/import", {
				method: "POST",
				body: formdata,
				contentType: false,
			});

			return response;
		},
		async export({ format }) {
			const account = useAccountStore();
			const response = await account.fetch("/export", {
				method: "POST",
				body: JSON.stringify({
					format,
				}),
			});

			return response;
		},
	},
});
