<template>
    <div class="settings-section">
        <div class="about">
            <table class="about-table">
                <tr>
                    <td>Version</td>
                    <td>{{ about.data.version }}</td>
                </tr>
                <tr>
                    <td>Account Role</td>
                    <td>{{ account.account.role }}</td>
                </tr>
                <tr>
                    <td>Account ID</td>
                    <td>{{ account.account.id }}</td>
                </tr>
                <tr v-if="Object.prototype.hasOwnProperty.call(about.data, 'links')">
                    <td>Links</td>
                    <td>{{ formatNumber(about.data.links) }}</td>
                </tr>
                <tr v-if="Object.prototype.hasOwnProperty.call(about.data, 'accounts')">
                    <td>Accounts</td>
                    <td>{{ formatNumber(about.data.accounts) }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from "../../../stores/account";
import { useAbout } from "../../../stores/about";

export default {
    data() {
        return {
            account: useAccountStore(),
            about: useAbout(),
        };
    },
    methods: {
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

    > .about {
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
        table.about-table {
            border-collapse:separate;
            width: max-content;
            border: 1px solid var(--bg-color-3);
            border-radius: 10px;
            tr, th {

                border-radius: 10px;
            }
            tr {
                &:nth-of-type(2n) {
                    background: var(--bg-color-2);
                }
                td {
                    padding: 0.6rem 0.8rem;
                    &:nth-of-type(1) {
                        font-weight: 500;
                    }
                    &:nth-of-type(2) {
                        font-weight: 300;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        > .about {
            h2 {
                font-size: 2rem;
            }
            p {
                font-size: 1.5rem;
            }
            table.about-table {
                width: 100%;
                tr {
                    display: flex;
                    flex-direction: column;
                    margin: 0.5rem 0;
                    &:nth-of-type(2n) {
                        border-radius: 0;
                    }

                    td:first-of-type {
                        font-size: 1.3rem;
                    }
                }
            }
        }

    }
}
</style>
