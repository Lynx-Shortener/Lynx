<template>
	<div class="login">
		<h2>Login</h2>
		<FormKit type="form" submit-label="Login" :submit-attrs="{ 'data-type': 'primary' }" @submit="login" :actions="false">
			<FormKit type="text" label="Your username" v-model="logindata.username" validation="required:trim" autocomplete="username" />
			<FormKit type="password" label="Your password" v-model="logindata.password" validation="required:trim"  autocomplete="current-password" />
			<FormKit type="text" label="Your 2FA token" v-model="logindata.token" validation="number:required|length:6,6" v-if="requires2FA" autocomplete="one-time-code" />
			<a @click="lostTOTP" v-if="requires2FA" class="lostTOTP">Lost your authenticator?</a>
			<FormKit type="submit" label="Login" primary></FormKit>
			<p>{{ response }}</p>
		</FormKit>
		<a @click="gotoRegister"> Register </a>
	</div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { useConfig } from "../../stores/config";
import { usePopups } from '../../stores/popups';
export default {
	data() {
		return {
			config: useConfig(),
			popups: usePopups(),
			logindata: {
				username: "",
				password: "",
				token: ""
			},
			response: null,
			requires2FA: false
		};
	},
	methods: {
		async login() {
			this.response = null;
			const account = useAccountStore();
			const data = await account.login(this.logindata);
			if (data.success) {
				this.response = "Logged in!";
				if (this.$route.query.next) return this.$router.push(decodeURIComponent(this.$route.query.next));
				this.$router.push("/dash");
			} else {
				this.requires2FA = data.message === "2FA token required"
				if (!this.requires2FA) {
					this.response = data.message;
				}
			}
		},
		gotoRegister() {
			this.$router.push({
				path: "/dash/register",
				query: this.$route.query,
			});
		},
		lostTOTP() {
			this.popups.addPopup("LostTOTP", this.logindata);
		}
	},
	mounted() {
		if (this.config.data.demo) {
			this.logindata = {
				username: "demo",
				password: "demo"
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.login {
	display: flex;
	justify-content: center;
	flex-direction: column;
	height: 100%;
	width: 20rem;
	margin: 0 auto;
	h2 {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 2rem;
	}
	> a {
		margin-top: 0.5rem;
		cursor: pointer;
	}
	.lostTOTP {
		text-align: left;
		font-size: 0.8rem;
		margin-top: 0;
		cursor: pointer;
	}
	@media screen and (max-width: 768px) {
		height: 100vh;
	}
}
</style>
