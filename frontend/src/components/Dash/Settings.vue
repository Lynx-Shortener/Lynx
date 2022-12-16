<template>
	<div class="settings">
		<div class="account">
			<h2>Account</h2>
			<p>Here you can edit your login information and username.</p>
			<div class="inputs">
				<div class="input">
					<label>Email</label>
					<div @click="popups.addPopup('ChangeEmail', {})">{{ account.account.email }}</div>
				</div>
				<div class="input">
					<label>Username</label>
					<div @click="popups.addPopup('ChangeUsername', {})">{{ account.account.username }}</div>
				</div>
				<div class="input">
					<label>Password</label>
					<div @click="popups.addPopup('ChangePassword', {})">***********</div>
				</div>
			</div>
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
	methods: {
		handleClick() {
			console.log("ok");
		},
	},
};
</script>

.<style lang="scss" scoped>
.settings {
	padding: 2rem;
	text-align: left;

	.account {
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
		}
		.inputs {
			margin-top: 2rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			width: max-content;
			.input {
				width: 100%;
				label {
					font-weight: 500;
					font-size: 0.9rem;
					margin-bottom: 1rem;
					display: block;
				}
				div {
					border: 1px solid var(--bg-color-2);
					padding: 0.5rem;
					border-radius: 5px;
					min-width: 10rem;
					cursor: pointer;
				}
			}
		}
	}

	@media screen and (max-width: 768px) {
		.account {
			h2 {
				font-size: 3rem;
			}
			p {
				font-size: 1.5rem;
			}

			.inputs {
				.input {
					label {
						font-size: 1.1rem;
					}
					div {
						font-size: 1.2rem;
					}
				}
			}
		}
	}
}
</style>
