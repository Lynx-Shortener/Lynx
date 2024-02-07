<template>
    <div class="settings-section">
        <div class="login">
            <h2>Login</h2>
            <div class="inputs">
                <div class="input">
                    <label>Password</label>
                    <div :disabled="about.data.demo" @click="changeSetting('Password')">
                        ***********
                    </div>
                </div>
                <div class="input totp">
                    <label>2FA settings</label>
                    <button :disabled="about.data.demo" @click="toggleTOTP">
                        {{ account.account.totp ? "Disable" : "Enable" }} 2FA
                    </button>
                </div>
            </div>
        </div>
        <div class="sole-user">
            <h2>Automatic login</h2>
            <p>All requests will be automatically authenticated by this account.</p>
            <p>
                Requires <a href="https://docs.getlynx.dev/installation/environment-variables" target="_blank" rel="noopener noreferrer">SOLE_USER</a>
                to be set to <code style="background-color: var(--bg-color-2); padding: 0.2em; border-radius: 5px;">{{  account.account.id }}</code>
            </p>
            <p>Do not enable unless you have alternative authentication methods in place.</p>
            <div class="inputs" style="margin-top: 0">
                <div class="input automatic-login">
                    <button @click="toggleAutomaticLogin">
                        {{ account.account.allowAutomaticLogin ? "Disable" : "Enable" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from "../../../stores/account";
import { usePopups } from "../../../stores/popups";
import { useAbout } from "../../../stores/about";

export default {
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
        async toggleTOTP() {
            if (this.about.data.demo) return;
            const totpEnabled = this.account.account.totp;
            if (!totpEnabled) {
                this.popups.addPopup("EnableTOTP", {});
            } else {
                this.popups.addPopup("DisableTOTP", {});
            }
        },
        async toggleAutomaticLogin() {
            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loader");

            const response = await this.account.fetch("/auth/automatic-login", {
                method: this.account.account.allowAutomaticLogin ? "DELETE" : "POST",
                body: JSON.stringify({
                    verification: verificationData,
                }),
            });

            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                this.popups.addPopup("Information", {
                    title: `Error ${this.account.account.allowAutomaticLogin ? "disabling" : "enabling"} automatic login`,
                    description: response.message,
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "close-all",
                        },
                    ],
                });
                return;
            }

            this.account.getAccount();
        },
        async getConfig() {
            const data = await this.account.fetch("/sharex/config", {
                method: "GET",
            });

            if (!data.success) {
                this.popups.addPopup("Information", {
                    title: "Error getting sharex config",
                    description: data.message,
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "return",
                        },
                    ],
                });
                return;
            }

            const config = JSON.stringify(data.result.config, null, 4);

            const a = document.createElement("a");
            a.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(config)}`);
            a.setAttribute("download", "Lynx.sxcu");

            a.style.display = "none";
            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        },
        formatNumber(number) {
            return number.toLocaleString();
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
            line-height: 1.5em;
        }
        .inputs {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            width: max-content;
            .input {
                width: 100%;
                div {
                    border: 1px solid var(--bg-color-2);
                    padding: 0.5rem;
                    border-radius: 5px;
                    min-width: 10rem;
                    cursor: pointer;
                    &[disabled="true"] {
                        opacity: 0.5;
                        cursor: not-allowed !important;
                    }
                }
                &.totp {
                    p {
                        margin-bottom: 0.5rem;
                    }
                }
                > button {
                    background: var(--accent);
                    width: max-content;
                    padding: 0.5rem 1rem;
                    color: var(--accent-color);
                    border: none;
                    border-radius: 5px;
                    font: inherit;
                    cursor: pointer;
                    font-size: 1rem;
                    &[disabled] {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                }
                label {
                    font-weight: 500;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                    display: block;
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
                font-size: 1.3rem;
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
