<template>
    <div v-show="popups.popups.length" class="popupContainer" @click.self="popups.closeTopmost">
        <div v-for="popup in popups.popups" :key="popup.id" :class="['popup', popup.loaded ? 'loaded' : 'loading', !popup.loaded || popup.data.hideCross || !popup.component ? 'hide-cross' : '']">
            <div v-if="(popup.loaded && !popup.data.hideCross) || !popup.component" class="exitIcon" @click="popups.closePopup(popup.id)">
                <font-awesome-icon :icon="['fas','x']" />
            </div>
            <component
                :is="popup.component"
                v-show="popup.loaded"
                v-if="popup.component"
                :id="popup.id"
                :data="popup.data"
                class="popupComponent"
                @vue:mounted="popups.setLoaded(popup.id)"
            />
            <Loader v-if="!popup.loaded" />
        </div>
    </div>
</template>

<script>
import { usePopups } from "../stores/popups";
import { useDarkMode } from "../stores/dark";

export default {
    data() {
        return {
            popups: usePopups(),
            dark: useDarkMode(),
        };
    },
};
</script>

<style lang="scss" scoped>
.popupContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(black, 0.4);
    z-index: 1;
    display: grid;
    place-items: center;
    .popup {
        background: var(--bg-color-1);
        border-radius: 10px;
        position: relative;
        padding: 1rem;
        width: 40rem;
        max-width: 80vw;
        box-sizing: border-box;

        &:not(.hide-cross) {
            padding: 2rem 1rem 1rem;
        }
        .exitIcon {
            position: absolute;
            top: 0.8rem;
            right: 0.8rem;
            svg {
                cursor: pointer;
            }
        }
        &:not(:last-of-type) {
            display: none;
        }

        :deep(.popupComponent) {
            h2 {
                font-size: 2rem;
                font-weight: 500;
                margin-bottom: 1rem;
            }
            .buttons {
                margin-top: 1rem;
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 1rem;
                :deep(.formkit-outer) {
                    max-width: 60%;
                    background: red;
                }
            }
            > span {
                background: var(--bg-color-1);
                padding: 0 0.2rem;
                margin: 0 0.2rem;
                border-radius: 5px;
            }
        }
    }
}
</style>
