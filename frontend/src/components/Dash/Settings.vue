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
		<div class="integration">
			<h2>Integration</h2>
			<p>Here you can access your ShareX configuration file.</p>
			<button @click="getConfig">Download</button>
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
		async getConfig() {
			const data = await this.account.fetch("/sharex/config", {
				method: "GET",
			});

			if (!data.success) {
				alert("uhoh");
			}

			const config = JSON.stringify(data.result.config, null, 4);

			const a = document.createElement("a");
			a.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(config));
			a.setAttribute("download", "Lynx.sxcu");

			a.style.display = "none";
			document.body.appendChild(a);

			a.click();

			document.body.removeChild(a);
		},
	},
};
</script>

.<style lang="scss" scoped>
.settings {
	padding-block: 2rem;
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
