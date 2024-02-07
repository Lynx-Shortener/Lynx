<template>
    <div class="settings-section">
        <div class="account-information">
            <h2>Site Preferences</h2>
            <p>These settings are set per&#8209;browser and will not be synced.</p>
            <ul>
                <li>
                    <Toggle :modelValue="account.preferences.reducedPopups" @update:modelValue="account.updatePreference('reducedPopups', $event)"/>
                    <label>Hide confirmation popups, allowing for more efficient actions.</label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from "../../../stores/account";
import { usePopups } from "../../../stores/popups";
import { useAbout } from "../../../stores/about";
import Toggle from "../Toggle.vue";

export default {
    components: {
        Toggle,
    },
    data() {
        return {
            account: useAccountStore(),
            popups: usePopups(),
            about: useAbout(),
        };
    },
    methods: {
        changeSetting(name) {
            if (this.about.data.demo) return;
            this.popups.addPopup(`Change${name}`, { account: this.account.account.id });
        },
    },
};
</script>

.<style lang="scss" scoped>
.settings-section {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    > div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        h2 {
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--color-2);
        }
        p {
            color: var(--color-3);
            font-weight: 300;
            max-width: 80ch;
        }

        ul {
            li {
                display: grid;
                grid-template-columns: 3.5rem 1fr;
                gap: 1rem;
                align-items: center;

                label {
                    line-height: 1.4em;
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        > div {
            h2 {
                font-size: 2rem;
            }
            p {
                font-size: 1.5rem;
            }

            .inputs {
                width: 100%;
                .input {
                    label {
                        font-size: 1.1rem;
                        line-height: 1.5;
                    }
                    div {
                        font-size: 1.2rem;
                    }
                    &.secret {
                        width: 100%;
                        > div {
                            width: 100%;
                            flex-direction: column;
                            box-sizing: border-box;
                            align-items: flex-start;
                            p {
                                font-size: 1.3rem;
                                text-align: left;
                            }
                            .actions {
                                display: grid;
                                grid-template-columns: repeat(3, 1fr);
                                width: 100%;
                                .action {
                                    width: 100%;
                                }
                            }
                        }
                    }
                    button {
                        padding: 1rem 1.5rem;
                        font-size: 1.2rem;
                    }
                }
            }
        }
    }
}
</style>
