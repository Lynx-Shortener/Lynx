<template>
	<div class="users">
		<h2>User Management</h2>
		{{ users }}
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
			const userResponse = await this.account.fetch("/user/list");
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
				&.totp {
					p {
						margin-bottom: 0.5rem;
					}
				}
				&:not(.secret) {
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
								&[disabled="true"] {
									opacity: 0.5;
									cursor: not-allowed !important;
								}
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
