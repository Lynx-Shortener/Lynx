<template>
    <div class="secret-box">
        <p>{{ !secret ? "No secret set." : secretVisible ? secret : Array(32).fill("&#8226;").join("") }}</p>
        <div class="actions">
            <div class="action view" @click="toggleSecret" :disabled="!secret">
                <font-awesome-icon :icon="secretVisible ? 'eye-slash' : 'eye'" />
            </div>
            <div class="action new" @click="newSecret(this.userID)" :disabled="about.data.demo">
                <font-awesome-icon :icon="newSecretData.success ? 'check' : 'arrows-rotate'" :spinning="newSecretData.loading" />
            </div>
            <div class="action copy" @click="copySecret">
                <font-awesome-icon :icon="clipboard.success ? 'check' : 'clipboard'" />
            </div>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { useAbout } from "../../stores/about";

export default {
    props: ["secret", "userID"],
    data() {
        return {
            secretVisible: false,
            account: useAccountStore(),
            about: useAbout(),
            newSecretData: {
                loading: false,
                success: false,
            },
            clipboard: {
                success: false,
            },
        };
    },
    methods: {
        toggleSecret() {
            if (!this.secret) return;
            this.secretVisible = !this.secretVisible;
        },
        async newSecret(id) {
            if (this.about.data.demo) return;
            this.newSecretData.success = false;
            this.newSecretData.loading = true;
            const newSecret = await this.account.newSecret({ id });
            if (newSecret) {
                if (this.$route.path === "/dash/users") {
                    this.$emit("update-user", id, { secret: newSecret });
                }
                this.newSecretData.success = true;
                setTimeout(() => {
                    this.newSecretData.success = false;
                }, 2000);
            }
            this.newSecretData.loading = false;
        },
        async copySecret() {
            this.clipboard.success = true;
            navigator.clipboard.writeText(this.account.account.secret);
            setTimeout(() => {
                this.clipboard.success = false;
            }, 2000);
        },
    },
};
</script>

<style lang="scss" scoped>
.secret-box {
    display: flex;
    flex-wrap: row;
    align-items: center;
    border: 1px solid var(--bg-color-2);
    border-radius: 5px;
    width: max-content;
    height: max-content;
    overflow: hidden;

    p {
        padding: 0.5rem;
        font-family: monospace;
        box-sizing: border-box;
        margin: 0;
        height: max-content;
        line-height: 1;
        width: calc(32ch + 1rem);
    }
    .actions {
        display: flex;
        align-items: center;
        > div {
            &[disabled="true"] {
                opacity: 0.5;
                cursor: not-allowed !important;
            }
            padding: 0.5rem;
            display: grid;
            place-content: center;
            box-sizing: border-box;
            cursor: pointer;
            width: 2rem;
            color: var(--accent-color);
            &.view {
                background: var(--accent);
                &:hover {
                    background: var(--accent-hover);
                }
            }
            &.copy {
                background: #3ca4e9;
                &:hover {
                    background: lighten(#3ca4e9, 5%);
                }
            }
            &.new {
                background: var(--color-error);
                &:hover {
                    background: var(--color-error-hover);
                }
                svg {
                    &[spinning="true"] {
                        animation: spin 1s linear infinite;
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(180deg);
                            }
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 1200px) and (min-width: 769px) {
        p {
            width: calc(14ch + 1rem);
        }
    }
    @media screen and (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        align-items: flex-start;
        .actions {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            > div {
                width: 100%;
            }
        }
    }
}
</style>
