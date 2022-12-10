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
		meta: {
			requiresLogin: true,
		},
	},
	{
		path: "/login",
		component: () => import("../views/Login.vue"),
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
			path: "/login",
			query: {
				next: encodeURIComponent(to.fullPath),
			},
		});
	}
	next();
});

export default router;
