<template>
    <div class="createLink">
        <h2>Create link</h2>
        <FormKit type="form"
                 @submit="create"
                 submit-label="Create Link"
                 :submit-attrs="{ 'button-type': 'primary' }">
            <table>
                <tr>
                    <td><strong>Destination URL</strong></td>
                    <td>
                        <FormKit type="text" v-model="link.destination" />
                    </td>
                </tr>
                <tr>
                    <td><strong>Custom Slug</strong></td>
                    <td>
                        <FormKit type="text" v-model="link.slug" />
                    </td>
                </tr>
            </table>
        </FormKit>
    </div>
</template>

<script>
import { usePopups } from "../../stores/popups";
import { useLinks } from "../../stores/links";
import { useAbout } from "../../stores/about";
import { useAccountStore } from "../../stores/account";

export default {
    data() {
        return {
            links: useLinks(),
            popups: usePopups(),
            about: useAbout(),
            account: useAccountStore(),
            link: {
                destination: "",
                slug: "",
            },
        };
    },
    methods: {
        async create() {
            const response = await this.links.create(this.link);
            if (!response.success) {
                this.popups.addPopup("Information", {
                    title: "Error creating your link",
                    description: response.message,
                    buttons: [
                        {
                            name: "Retry",
                            type: "primary",
                            action: "return",
                        },
                        {
                            name: "Cancel",
                            type: "secondary",
                            action: "close-all",
                        },
                    ],
                });
            } else {
                this.about.track("Link Created");
                this.about.addLink();
                this.popups.closeSelf(this);
                if (this.account.preferences.reducedPopups) return;
                this.popups.addPopup("Information", {
                    title: "Successfully created your link",
                    description: `Your short link is <a href="${response.result.link.link}" target="_blank">${response.result.link.slug}</a>`,
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "close-all",
                        },
                    ],
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.createLink {
    > h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    :deep(.formkit-form) {
        table {
            margin-bottom: 1rem;
            border-spacing: 5px;
            tr {
                td:nth-of-type(1) {
                    text-align: left;
                    padding-right: 0.8rem;
                    line-height: 1.4;
                    white-space: nowrap;
                }
                td:nth-of-type(2) {
                    width: 100%;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        :deep(.formkit-form) {
            table {
                width: 100%;
                tr {
                    td {
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
    }
}
</style>
