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
			<p>Here you can access your ShareX configuration file and manage your secret.</p>

			<div class="inputs">
				<div class="input secret">
					<label>Your Secret</label>
					<div>
						<p>{{ secretVisible ? account.account.secret || "No secret set." : Array(32).fill("&#8226;").join("") }}</p>
						<div class="actions">
							<div class="action view" @click="secretVisible = !secretVisible">
								<font-awesome-icon :icon="secretVisible ? 'eye-slash' : 'eye'" />
							</div>
							<div class="action new" @click="newSecret">
								<font-awesome-icon :icon="newSecretData.success ? 'check' : 'arrows-rotate'" :spinning="newSecretData.loading" />
							</div>
							<div class="action copy" @click="copySecret">
								<font-awesome-icon :icon="clipboard.success ? 'check' : 'clipboard'" />
							</div>
						</div>
					</div>
				</div>
				<div class="input">
					<label>Download your ShareX Config (requires a secret to be set)</label>
					<button @click="getConfig" :disabled="account.account.secret === undefined">Download</button>
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
			secretVisible: false,
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
		async getConfig() {
			const data = await this.account.fetch("/sharex/config", {
				method: "GET",
			});

			if (!data.success) {
				alert("Error retrieving ShareX config.");
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
		async newSecret() {
			this.newSecretData.success = false;
			this.newSecretData.loading = true;
			await this.account.newSecret();
			this.newSecretData.loading = false;
			this.newSecretData.success = true;
			setTimeout(() => {
				this.newSecretData.success = false;
			}, 2000);
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
				&:not(.secret) {
					width: 100%;
					div {
						border: 1px solid var(--bg-color-2);
						padding: 0.5rem;
						border-radius: 5px;
						min-width: 10rem;
						cursor: pointer;
					}
				}
				&.secret {
					> div {
						display: flex;
						flex-wrap: row;
						align-items: center;
						border: 1px solid var(--bg-color-2);
						border-radius: 5px;
						width: max-content;
						margin-top: 1rem;
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
		padding-inline: 2rem;
		> div {
			h2 {
				font-size: 3rem;
			}
			p {
				font-size: 1.5rem;
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
					&.secret {
						width: 100%;
						> div {
							width: 100%;
							flex-direction: column;
							box-sizing: border-box;
							align-items: flex-start;
							p {
								font-size: 1.3rem;
								text-align: left;
							}
							.actions {
								display: grid;
								grid-template-columns: repeat(3, 1fr);
								width: 100%;
								.action {
									width: 100%;
								}
							}
						}
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
