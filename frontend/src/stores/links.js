import { defineStore } from "pinia";
import { useAccountStore } from "./account";

export const useLinks = defineStore("links", {
    state: () => ({
        links: [],
        sort: {
            field: "creationDate",
            type: -1,
        },
        remainingPages: 1,
        pagesize: 80,
        page: 0,
        selectedLinks: [],
    }),
    actions: {
        clear() {
            this.links = [];
            this.remainingPages = 1;
            this.page = 0;
        },
        formatDate(dateString) {
            function ordinalSuffixOf(i) {
                const j = i % 10;
                const k = i % 100;
                if (j === 1 && k !== 11) {
                    return `${i}st`;
                }
                if (j === 2 && k !== 12) {
                    return `${i}nd`;
                }
                if (j === 3 && k !== 13) {
                    return `${i}rd`;
                }
                return `${i}th`;
            }

            const date = new Date(dateString);
            const day = ordinalSuffixOf(date.getDate());
            const month = date.toLocaleString("default", { month: "short" });
            const year = date.getFullYear();

            return `${month} ${day}, ${year}`;
        },
        async paginate({ search, userID }) {
            const account = useAccountStore();
            const response = await account.fetch(
                `/link/list?${
                    new URLSearchParams({
                        page: this.page,
                        pagesize: this.pagesize,
                        sortType: this.sort.type,
                        sortField: this.sort.field,
                        search,
                        userID,
                    })}`,
                {},
            );

            this.page += 1;

            const links = response.result.links.map((link) => {
                link.creationDate = this.formatDate(link.creationDate);
                link.visits = new Intl.NumberFormat("default", {}).format(link.visits || 0);
                return link;
            });

            this.links = this.links.concat(links);
            this.remainingPages = response.result.remaining;
        },
        async create({ slug, destination }) {
            const account = useAccountStore();
            const response = await account.fetch("/link", {
                method: "POST",
                body: JSON.stringify({ slug, destination }),
            });

            if (!response.success) return response;

            const link = response.result;

            link.creationDate = this.formatDate(link.creationDate);

            link.link = `${window.location.origin}/${response.result.slug}`;

            this.links.unshift(link);

            return {
                success: true,
                result: { link },
            };
        },
        async get(id) {
            const account = useAccountStore();
            const link = await account.fetch(`/link/single?id=${id}`, {
                method: "GET",
            });

            if (link.success) return link.result;
            return null;
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
            const link = response.result;

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
            this.selectedLinks = this.selectedLinks.filter((id) => !ids.includes(id));

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
