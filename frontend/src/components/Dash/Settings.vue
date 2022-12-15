<template>
	<div class="settings">
		<h1>Settings</h1>
		<div class="account">
			<h2>Account</h2>
			<table>
				<tr>
					<td>Email</td>
					<td>{{ account.account.email }}</td>
					<td>
						<FormKit type="button" input-class="edit" @click="popups.addPopup('ChangeEmail', {})">
							<font-awesome-icon icon="pencil" />
						</FormKit>
					</td>
				</tr>
				<tr>
					<td>Username</td>
					<td>{{ account.account.username }}</td>
				</tr>
				<tr>
					<td>Password</td>
					<td>***********</td
					><td>
						<FormKit type="button" input-class="edit" @click="popups.addPopup('ChangePassword', {})">
							<font-awesome-icon icon="pencil" />
						</FormKit>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";
export default {
	data() {
		return {
			account: useAccountStore(),
			popups: usePopups(),
		};
	},
};
</script>

.<style lang="scss" scoped>
.settings {
	padding: 2rem;
	text-align: left;
	h1 {
		font-size: 2.5rem;
		font-weight: 500;
		margin-bottom: 2rem;
	}
	h2 {
		font-size: 1.5rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}
	.account {
		background: var(--bg-color-2);
		width: max-content;
		padding: 1rem;
		border-radius: 10px;
		h2 {
			border-bottom: 1px solid var(--bg-color-1);
			padding-bottom: 0.5rem;
		}
		table {
			tr {
				td {
					padding: 0.2rem 0.5rem;
					vertical-align: middle;
					&:first-of-type {
						font-weight: 500;
					}
				}
			}
			:deep(.formkit-outer) {
				margin: 0;
				.formkit-wrapper {
					button {
						border-radius: 5px;
						padding: 0.4rem 0.8rem;
						background: var(--accent);
						color: var(--accent-color);
						&.delete,
						&.cancel {
							background: var(--color-error);
						}
					}
				}
			}
		}
	}
}
</style>
