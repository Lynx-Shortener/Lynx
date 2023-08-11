<template>
    <div class="backupCodes">
        <h2>2FA Sucessfully Enabled</h2>
        <p>Please make a note of the following backup codes incase you lose your authenticator app:</p>
        <div class="backupCodes">
            <p v-for="backupCode in data.backupCodes" :key=backupCode>
                {{ backupCode }}
            </p>
        </div>
        <FormKit type="button"
                 label="Okay"
                 primary
                 @click="popups.closeAll"></FormKit>
    </div>
</template>

<script>
import { usePopups } from "../../stores/popups";

export default {
    props: ["data"],
    data() {
        return {
            popups: usePopups(),
        };
    },
};
</script>

<style lang="scss" scoped>
.backupCodes {
    > h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    .backupCodes {
        font-family: monospace;
        padding: 0.2em 0.4em;
        background: var(--bg-color-2);
        border-radius: 8px;
        width: max-content;
        margin: 1rem auto;
        box-sizing: border-box;
        color: var(--color-1);
        font-size: 1rem;
    }
}
</style>
