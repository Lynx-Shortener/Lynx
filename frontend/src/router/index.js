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
                path: "/dash/users",
                component: () => import("../components/Dash/Users.vue"),
                meta: {
                    requiresLogin: true,
                },
            },
            {
                path: "/dash/settings",
                component: () => import("../components/Dash/Settings/Index.vue"),
                meta: {
                    requiresLogin: true,
                    title: "Settings",
                    disableDashboardGap: true,
                },
                redirect: "/dash/settings/account",
                children: [
                    {
                        path: "/dash/settings/account",
                        component: () => import("../components/Dash/Settings/Account.vue"),
                        meta: {
                            title: "Account Settings",
                        },
                    },
                    {
                        path: "/dash/settings/preferences",
                        component: () => import("../components/Dash/Settings/Preferences.vue"),
                        meta: {
                            title: "Preferences",
                        },
                    },
                    {
                        path: "/dash/settings/security",
                        component: () => import("../components/Dash/Settings/Security.vue"),
                        meta: {
                            title: "Security Settings",
                        },
                    },
                    {
                        path: "/dash/settings/about",
                        component: () => import("../components/Dash/Settings/About.vue"),
                        meta: {
                            title: "About",
                        },
                    },
                ],
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
