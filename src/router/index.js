import { createRouter, createWebHistory } from "vue-router";
import { useAccountStore } from "../stores/account";

const routes = [
	{
		path: "/",
		name: "Home",
		redirect: "/dash/overview",
	},
	{
		path: "/dash",
		component: () => import("../views/dashboard/Index.vue"),
		redirect: "/dash/overview",
		children: [
			{
				path: "/dash/overview",
				component: () => import("../views/dashboard/Overview.vue"),
				meta: {
					requiresLogin: true,
				},
			},
			{
				path: "/dash/login",
				component: () => import("../views/dashboard/Login.vue"),
				meta: {
					hideSidebar: true,
				},
			},
		],
	},
	{
		path: "/:pathMatch(.*)*",
		component: () => import("../views/Link.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to, from, next) => {
	const account = useAccountStore();
	if (to.meta.requiresLogin) {
		if (account.account === null && account.token !== null) {
			await account.getAccount();
		}
		if (account.account === null) {
			return next({
				path: "/dash/login",
				query: {
					next: encodeURIComponent(to.fullPath),
				},
			});
		}
	}

	next();
});

export default router;
