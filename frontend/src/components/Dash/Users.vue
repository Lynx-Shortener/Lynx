<template>
    <div class="users">
        <h2>User Management - {{ roles.find(([hRole, role]) => role === account.account.role)[0] }}</h2>
        <table>
            <thead>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Secret</th>
                <th class="add-user" align="right">
                    <font-awesome-icon :icon="['fas', 'fa-circle-plus']" @click="createUser" />
                </th>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td class="role">
                        <span>{{ user.role }}</span>
                        <font-awesome-icon
                            v-if="user.id !== account.account.id && account.account.role === 'owner'"
                            icon="ellipsis-vertical"
                            @click="updateRoleMenu($event, user)"
                        />
                    </td>
                    <td
                        class="user-secret"
                        :secret-set="!!user.secret"
                    >
                        <SecretBox
                            :secret="user.secret"
                            :user-i-d="user.id"
                            @update-user="updateUser"
                        />
                    </td>
                    <td class="delete-user">
                        <font-awesome-icon v-if="user.id !== account.account.id" icon="trash-can" @click="deleteUser(user)" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import ContextMenu from "@imengyu/vue3-context-menu";
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";
import SecretBox from "./SecretBox.vue";

export default {
    components: {
        SecretBox,
    },
    data() {
        return {
            users: [],
            account: useAccountStore(),
            popups: usePopups(),
            roles: [["Owner", "owner"], ["Admin", "admin"], ["Standard", "standard"]],
        };
    },
    mounted() {
        this.getUsers();
    },
    methods: {
        async getUsers() {
            const userResponse = await this.account.fetch("/user/list", {});
            if (!userResponse.success) {
                this.popups.addPopup("Information", {
                    title: "Error getting list of users",
                    description: userResponse.message,
                    buttons: [
                        {
                            name: "Retry",
                            type: "primary",
                            action: "refresh",
                        },
                        {
                            name: "Cancel",
                            type: "secondary",
                            actions: ["navigate-home", "return"],
                        },
                    ],
                });
            } else {
                this.users = userResponse.result;
            }
        },
        updateUser(userID, updatedValues) {
            const userIndex = this.users.findIndex((user) => user.id === userID);

            this.users[userIndex] = { ...this.users[userIndex], ...updatedValues };
        },
        async createUser() {
            const userCreation = await this.popups.addPopup("CreateUser", { async: true });

            if (userCreation.success) {
                await this.getUsers();
            }
        },
        async deleteUser(user) {
            const buttonClicked = await this.popups.addPopup("Information", {
                title: `Are you sure you want to delete ${user.username}?`,
                buttons: [
                    {
                        name: "Yes",
                        type: "primary",
                        action: "return",
                        confirm: true,
                    },
                    {
                        name: "No",
                        type: "secondary",
                        action: "return",
                        confirm: false,
                    },
                ],
                async: true,
            });

            if (!buttonClicked || (buttonClicked && !buttonClicked.confirm)) return;

            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loading", { hideCross: true });

            const response = await this.account.fetch("/user", {
                method: "DELETE",
                body: JSON.stringify({
                    user: {
                        id: user.id,
                    },
                    verification: verificationData,
                }),
            });

            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                this.getUsers();
                this.popups.addPopup("Information", {
                    title: "Error deleting the user",
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

            await this.getUsers();
        },
        updateRoleMenu(e, user) {
            if (user.id === this.account.account.id || this.account.account.role !== "owner") return;
            e.preventDefault();
            const items = this.roles.map(([roleName, roleID]) => ({
                label: roleName,
                disabled: roleID === user.role,
                onClick: () => {
                    this.changeUserRole(roleID, user.id);
                },
            }));
            ContextMenu.showContextMenu({
                x: e.x,
                y: e.y,
                items,
            });
        },
        async changeUserRole(role, userID) {
            if (role === "owner") {
                const buttonClicked = await this.popups.addPopup("Information", {
                    title: "Promoting this user to owner will demote you to an admin, are you sure you want to continue?",
                    buttons: [
                        {
                            name: "Yes",
                            type: "primary",
                            action: "return",
                            confirm: true,
                        },
                        {
                            name: "No",
                            type: "secondary",
                            action: "return",
                            confirm: false,
                        },
                    ],
                    async: true,
                });

                if (!buttonClicked || (buttonClicked && !buttonClicked.confirm)) return;
            }

            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loading", { hideCross: true });

            const response = await this.account.fetch("/user/role", {
                method: "POST",
                body: JSON.stringify({
                    user: {
                        role,
                        userID,
                    },
                    verification: verificationData,
                }),
            });

            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                this.getUsers();
                this.popups.addPopup("Information", {
                    title: "Error updating the user",
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

            this.updateUser(userID, response.result.user);
            if (role === "owner") {
                this.updateUser(this.account.account.id, { role: "admin" });
                await this.account.getAccount();
                // Hide the new owner when the current user is no longer the owner
                this.users = this.users.filter((user) => user.role !== "owner");
            }
        },
    },
};
</script>

.<style lang="scss" scoped>
.users {
    padding-block: 2rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    h2 {
        font-size: 2rem;
        font-weight: 500;
    }

    table {
        width: 100%;
        thead {
            color: var(--accent-color);
            th {
                background: var(--accent);
                padding: 0.8rem;
                &:first-of-type {
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                }
                &:last-of-type {
                    border-top-right-radius: 10px;
                    border-bottom-right-radius: 10px;
                }
                &.add-user {
                    text-align: right;
                    font-size: 1.4rem;
                    cursor: pointer;
                }
            }
        }
        tbody {
            td {
                padding: 0.8rem;
                &.role {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    svg {
                        cursor: pointer;
                    }
                }

                &.delete-user {
                    text-align: right;
                    svg {
                        cursor: pointer;
                        &:hover {
                            color: var(--color-error);
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        padding-inline: 2rem;
    }
}
</style>