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
		component: () => import("../views/Dashboard.vue"),
		redirect: "/dash/overview",
		children: [
			{
				path: "/dash/overview",
				component: () => import("../components/Dash/Overview.vue"),
				meta: {
					requiresLogin: true,
				},
			},
			{
				path: "/dash/settings",
				component: () => import("../components/Dash/Settings.vue"),
				meta: {
					requiresLogin: true,
					title: "Settings",
				},
			},
			{
				path: "/dash/login",
				component: () => import("../components/Dash/Login.vue"),
				meta: {
					hideSidebar: true,
					title: "Login",
				},
			},
			{
				path: "/dash/register",
				component: () => import("../components/Dash/Register.vue"),
				meta: {
					hideSidebar: true,
					title: "Register",
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
	if (to.meta) {
		if (to.meta.title) {
			document.title = `${to.meta.title} | Lynx`;
		} else {
			document.title = "Lynx";
		}
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
	}

	next();
});

export default router;
