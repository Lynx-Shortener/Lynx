<template>
	<div class="users">
		<h2>User Management</h2>
		<p>Manage other users such as their usernames, emails and roles.</p>
		<table>
			<thead>
				<th>Username</th>
				<th>Email</th>
				<th>Role</th>
				<th>Secret</th>
				<th>Action</th>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user.id">
					<td>{{ user.username }}</td>
					<td>{{ user.email }}</td>
					<td>{{ user.role }}</td>
					<tr>{{ user.secret }}</tr>
					<td class="actions"><font-awesome-icon icon="check"/></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";
export default {
	data() {
		return {
			users: [],
			account: useAccountStore(),
			popups: usePopups(),
		};
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
							action: "navigate-back",
						},
					],
				});
			} else {
				this.users = userResponse.result;
			}
		},
	},
	mounted() {
		this.getUsers();
	}
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
			}
		}
		tbody {
			td {
				padding: 0.8rem;
			}
		}
	}

	@media screen and (max-width: 768px) {
		padding-inline: 2rem;
	}
}
</style>
