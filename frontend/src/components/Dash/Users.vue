<template>
    <div class="users">
        <h2>User Management - {{ roles.find(([hRole, role]) => role === account.account.role)[0] }}</h2>
        <button class="create-user" @click="createUser">
            <font-awesome-icon :icon="['fas', 'fa-circle-plus']" />
            <span>Create User</span>
        </button>
        <table>
            <thead>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Secret</th>
                <th class="add-user" align="right">
                    <font-awesome-icon :icon="['fas', 'fa-circle-plus']" @click="createUser" />
                </th>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td :class="canUpdate(user) ? 'editable' : ''" @click="updateUsername(user)">
                        <font-awesome-icon :icon="['fas', 'user']" class="mobile-icon"/>
                        <span>{{ user.username }}</span>
                        <font-awesome-icon :icon="['fas', 'pencil']" class="edit-pencil" />
                    </td>
                    <td :class="canUpdate(user) ? 'editable' : ''" @click="updateEmail(user)">
                        <font-awesome-icon :icon="['fas', 'envelope']" class="mobile-icon"/>
                        <span>{{ user.email }}</span>
                        <font-awesome-icon :icon="['fas', 'pencil']" class="edit-pencil" />
                    </td>
                    <td :class="canUpdate(user) ? 'editable' : ''" @click="updatePassword(user)">
                        <font-awesome-icon :icon="['fas', 'key']" class="mobile-icon" />
                        <span>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
                        <font-awesome-icon :icon="['fas', 'pencil']" class="edit-pencil" />
                    </td>
                    <td class="role">
                        <font-awesome-icon :icon="['fas', 'users']" class="mobile-icon"/>
                        <span>{{ user.role }}</span>
                        <font-awesome-icon
                            v-if="user.id !== account.account.id && account.account.role === 'owner'"
                            :icon="['fas','ellipsis-vertical']"
                            @click="updateRoleMenu($event, user)"
                            class="update-role-icon"
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
                        <button @click="updateRoleMenu($event, user)" v-if="user.id !== account.account.id && account.account.role === 'owner'" class="update-role">
                            <font-awesome-icon :icon="['fas','users']"/>
                            Update Role
                        </button>
                        <button @click="deleteUser(user)" v-if="user.id !== account.account.id" class="delete-user">
                            <font-awesome-icon  :icon="['fas','trash-can']"/>
                            Delete
                        </button>
                    </td>
                    <td class="delete-user">
                        <font-awesome-icon v-if="user.id !== account.account.id" :icon="['fas','trash-can']" @click="deleteUser(user)" />
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
        async updateUsername(user) {
            const data = await this.popups.addPopup("ChangeUsername", { account: user.id, async: true });
            this.updateUser(user.id, data.account);
        },
        async updateEmail(user) {
            const data = await this.popups.addPopup("ChangeEmail", { account: user.id, async: true });
            this.updateUser(user.id, data.account);
        },
        async updatePassword(user) {
            const data = await this.popups.addPopup("ChangePassword", { account: user.id, async: true });
            this.updateUser(user.id, data.account);
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
            const loadingPopup = await this.popups.addPopup("Loader");

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
            const loadingPopup = await this.popups.addPopup("Loader");

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
        canUpdate(user) {
            // if user is yourself, or you have a higher role
            return this.account.account.id === user.id
                || (this.account.account.role === "owner" && user.role !== "owner")
                || (this.account.account.role === "admin" && user.role === "standard");
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

    button.create-user {
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        border: 0;
        border-radius: 5px;
        background-color: var(--accent);
        color: white;
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
                white-space: nowrap;
                &.role {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    svg.update-role-icon {
                        cursor: pointer;
                    }
                }

                &.editable {
                    gap: 1rem;
                    font-weight: bold;
                    color: var(--color-4);
                    transition: 250ms ease-in-out;
                    cursor: pointer;
                    svg.edit-pencil {
                        margin-left: 1rem;
                    }
                    &:hover {
                        color: var(--color-2);
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

    @media screen and (max-width: 1200px) {
        table {
            tr {
                thead {
                    th {
                        padding: 0.3rem;
                    }
                }
                td {
                    padding: 0.6rem 0.3rem;
                    .edit-pencil {
                        display: none;
                    }
                }
            }
        }
    }

    @media screen and (min-width: 768px) {
        button.create-user {
            display: none;
        }
        table {
            tr {
                td {
                    .mobile-icon {
                        display: none;
                    }
                    &.user-secret {
                        button {
                            display: none;
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        padding-inline: 2rem;
        table {
            thead {
                display: none;
            }
            tbody {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                tr {
                    display: block;
                    td {
                        display: block;
                        padding: 0.5rem;
                        display: flex;
                        gap: 1rem;
                        svg {
                            width: 1rem;
                        }
                        &.role {
                            justify-content: flex-start;
                            svg.update-role-icon {
                                display: none;
                            }
                        }
                        &.delete-user {
                            display: none;
                        }
                        &.user-secret {
                            display: grid;
                            grid-template-columns: 2fr 1fr;
                            gap: 0.5rem;
                            &:deep(.secret-box) {
                                margin-top: 0;
                                grid-column: 1/3;
                            }
                            button {
                                display: block;
                                height: calc(2rem + 2px);
                                padding: 0.5rem;
                                border: none;
                                border-radius: 5px;
                                flex-grow: 1;
                                display: flex;
                                gap: 0.5rem;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                svg {
                                    width: 1rem;
                                }
                                &.update-role {
                                    background-color: var(--accent);
                                    color: white;
                                }
                                &.delete-user {
                                    background-color: var(--color-error);
                                    color: white;
                                }
                            }
                            button:first-of-type.delete-user {
                                grid-column: 1/3;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
