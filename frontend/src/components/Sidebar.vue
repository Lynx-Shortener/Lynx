<template>
    <div class="sidebar">
        <div class="sidebarContent">
            <div class="upperIcons">
                <router-link to="/dash/overview">
                    <font-awesome-icon :icon="['fas','list']" />
                </router-link>
                <router-link v-if="['owner','admin'].includes(account.account.role)" to="/dash/users">
                    <font-awesome-icon :icon="['fas','users']" />
                </router-link>
                <router-link to="/dash/settings">
                    <font-awesome-icon :icon="['fas','gear']" />
                </router-link>
            </div>
            <div class="lowerIcons">
                <a class="darkmode" @click="darkMode.toggle()">
                    <font-awesome-icon :icon="darkMode.dark ? 'sun' : 'moon'" />
                </a>
                <a class="logout" @click="account.logout">
                    <font-awesome-icon :icon="['fas','right-from-bracket']" />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { useDarkMode } from "../stores/dark";
import { useAccountStore } from "../stores/account";

export default {
    data() {
        return {
            darkMode: useDarkMode(),
            account: useAccountStore(),
        };
    },
};
</script>

<style lang="scss" scoped>
.sidebar {
    height: 100vh;
    padding: 1rem;
    box-sizing: border-box;
    .sidebarContent {
        background: var(--accent);
        height: 100%;
        width: 100%;
        border-radius: 10px;
        padding: 2rem 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .upperIcons,
        .lowerIcons {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            a {
                color: var(--accent-color-inactive);
                font-size: 1.4rem;
                padding: 0.5rem;
                box-sizing: border-box;
                cursor: pointer;
                transition: 250ms ease-in-out;
                border-radius: 5px;
                &.router-link-active {
                    background: var(--accent-hover);
                    color: var(--accent-color);
                }

                &:hover {
                    background: var(--accent-hover);
                    color: var(--accent-color);
                    &.router-link-exact-active {
                        background: var(--accent-hover-active);
                    }
                }
            }
        }

        .lowerIcons {
            a {
                color: var(--accent-color);
            }
        }
    }

    @media screen and (max-width: 768px) {
        width: 100%;
        height: max-content;
        padding: 0;
        .sidebarContent {
            flex-direction: row;
            padding: 1rem;
            border-radius: 0;
            .upperIcons,
            .lowerIcons {
                flex-direction: row;
            }
        }
        a {
            height: max-content;
            p {
                display: none;
            }
        }
        .upperIcons > a {
            svg {
                font-size: 1.3rem;
            }
        }
        .upperIcons,
        .lowerIcons {
            display: flex;
            flex-direction: row;
        }
    }
}
</style>
