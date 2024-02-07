<template>
    <div class="settings">
        <h1>Settings</h1>
        <nav>
            <ul>
                <router-link to="/dash/settings/account" class="settings-tab">
                    <li>
                        <font-awesome-icon :icon="['fas', 'user']"/>
                        <span>Account</span>
                    </li>
                </router-link>
                <router-link to="/dash/settings/security" class="settings-tab">
                    <li>
                        <font-awesome-icon :icon="['fas', 'key']"/>
                        <span>Login & Security</span>
                    </li>
                </router-link>
                <router-link to="/dash/settings/preferences" class="settings-tab">
                    <li>
                        <font-awesome-icon :icon="['fas', 'wrench']"/>
                        <span>Preferences</span>
                    </li>
                </router-link>
                <router-link to="/dash/settings/about" class="settings-tab">
                    <li>
                        <font-awesome-icon :icon="['fas', 'circle-info']"/>
                        <span>About</span>
                    </li>
                </router-link>
                <div id="settings-tab-underline"></div>
            </ul>
        </nav>
        <div class="settings-content">
            <router-view/>
        </div>
    </div>
</template>

<script>
export default {
    watch: {
        "$route.path": function () {
            this.positionTabUnderline();
        },
    },
    methods: {
        positionTabUnderline() {
            const tabs = [...document.getElementsByClassName("settings-tab")];
            const underlineBar = document.getElementById("settings-tab-underline");
            let totalWidth = 0;

            tabs.forEach((tab, index) => {
                if (tab.getAttribute("href") === this.$route.path) {
                    let leftOffset = 0;
                    if (window.innerWidth < 768) {
                        const rem = window.getComputedStyle(document.documentElement).fontSize.split("px")[0];
                        const gapWidth = rem * 2;

                        leftOffset = index * gapWidth;
                    }
                    underlineBar.style.width = `${tab.clientWidth}px`;
                    underlineBar.style.left = `${totalWidth + leftOffset}px`;
                    underlineBar.style.opacity = 1;
                }

                totalWidth += tab.clientWidth;
            });
        },
    },
    mounted() {
        this.positionTabUnderline();

        window.addEventListener("resize", this.positionTabUnderline);
    },
    unmounted() {
        window.removeEventListener("resize", this.positionTabUnderline);
    },
};
</script>

.<style lang="scss" scoped>
.settings {
    text-align: left;
    gap: 2rem;
    padding: 1rem;

    > h1 {
        font-size: 2.5rem;
        padding: 1rem;
        font-weight: 500;
    }

    nav {
        padding: 1rem;
        ul {
            display: flex;
            position: relative;
            #settings-tab-underline {
                position: absolute;
                bottom: 0;
                left: 0;
                display: block;
                width: 0;
                height: 2px;
                background: var(--accent);
                transition: 250ms ease-in-out;
                opacity: 0;
            }

            a {
                text-decoration: none;
                color: var(--color-3);

                &.router-link-exact-active {
                    color: var(--color-1);
                }

                li {
                    display: flex;
                    justify-content: flex-start;
                    gap: 0.8rem;
                    padding: 0 0.8rem 1rem 0.8rem;

                    font-size: 1.2rem;
                    font-weight: 300;

                    svg {
                        font-size: 1rem;
                        display: none;
                    }
                }
            }
        }
    }

    .settings-content {
        padding: 2rem;
    }

    @media screen and (max-width: 768px) {
        padding: 1rem;

        nav {
            padding: 1rem 2rem;
            ul {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                a {
                    li {
                        display: grid;
                        place-content: center;
                        span {
                            display: none;
                        }
                        svg {
                            display: block;
                            font-size: 1.5rem;
                        }
                    }
                }
            }
        }

        .settings-content {
            padding: 0 2rem 1rem 2rem;
        }
    }
}
</style>
