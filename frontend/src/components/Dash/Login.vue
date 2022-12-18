<template>
	<div class="login">
		<h2>Login</h2>
		<FormKit type="form" submit-label="Login" :submit-attrs="{ 'data-type': 'primary' }" @submit="login" :actions="false">
			<FormKit type="text" label="Your username" v-model="logindata.username" validation="required:trim" />
			<FormKit type="password" label="Your password" v-model="logindata.password" validation="required:trim" />
			<FormKit type="submit" label="Login" primary></FormKit>
			<p>{{ response }}</p>
		</FormKit>
		<a @click="gotoRegister"> Register </a>
	</div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
export default {
	data() {
		return {
			logindata: {
				username: "",
				password: "",
			},
			response: null,
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
				this.response = data.message;
			}
		},
		gotoRegister() {
			this.$router.push({
				path: "/dash/register",
				query: this.$route.query,
			});
		},
	},
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
	@media screen and (max-width: 768px) {
		height: 100vh;
	}
}
</style>
