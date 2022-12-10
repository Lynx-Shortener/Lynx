import { createRouter, createWebHistory } from "vue-router";
import { useAccountStore } from "../stores/account";

import Home from "../views/Home.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		component: () => import("../views/About.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const account = useAccountStore();

	if (to.meta.requiresLogin && account.account === null) {
		return next({
			path: "/",
			query: {
				next: encodeURIComponent(to.fullPath),
			},
		});
	}
	next();
});

export default router;
