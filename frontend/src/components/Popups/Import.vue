<template>
    <div class="import">
        <h2>Upload your exported data</h2>
        <div class="upload">
            <div
                class="uploadBox"
                @click="uploadFile"
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.self="dragging = true"
                @dragleave.self="dragging = false"
                :dragging="dragging"
            >
                <font-awesome-icon :icon="file.data ? 'file' : 'file-arrow-up'" />
                <p>{{ file.name }}</p>
            </div>
            <input type="file"
                   :accept="filetypes[data.service]"
                   ref="fileInput"
                   @change="fileUpload" />
        </div>
        <div class="buttons">
            <FormKit type="button"
                     label="Back"
                     button-type="secondary"
                     @click="back" />
            <FormKit type="button"
                     label="Next"
                     button-type="primary"
                     @click="upload"
                     :disabled="!file.data" />
        </div>
    </div>
</template>

<script>
import { usePopups } from "../../stores/popups";
import { useLinks } from "../../stores/links";
import { useAbout } from "../../stores/about";

export default {
    props: ["data"],
    data() {
        return {
            popups: usePopups(),
            links: useLinks(),
            about: useAbout(),
            filetypes: {
                Shlink: [".csv"],
                YOURLS: [".csv"],
                Lynx: [".json", ".csv"],
            },
            file: {
                data: null,
                name: null,
            },
            dragging: false,
        };
    },
    methods: {
        back() {
            this.popups.closeSelf(this);
        },
        handleDragStart() {
            this.dragging = true;
        },
        handleDragEnd() {
            this.dragging = false;
        },
        uploadFile() {
            this.$refs.fileInput.click();
        },
        handleDragOver(e) {
            e.preventDefault();
        },
        handleDrop(e) {
            e.preventDefault();
            if (e.dataTransfer.items) {
                let file = [...e.dataTransfer.items][0];
                file = file.getAsFile();
                this.file.data = file;
                this.file.name = file.name;
            }
        },
        fileUpload() {
            const file = this.$refs.fileInput.files[0];
            this.file.data = file;
            this.file.name = file.name;
        },
        async upload() {
            const response = await this.links.import({
                file: this.file.data,
                service: this.data.service,
            });

            if (!response.success) {
                this.popups.addPopup("Information", {
                    title: "Error completing import",
                    description: response.message || "Please try again later",
                    buttons: [
                        {
                            name: "Retry",
                            type: "secondary",
                            action: "return",
                        },
                        {
                            name: "Okay",
                            type: "primary",
                            action: "close-all",
                        },
                    ],
                });
            } else {
                this.about.track(`Imported links from ${this.data.service}`);
                this.popups.closeSelf(this);
                if (this.account.preferences.reducedPopups) return;
                this.popups.addPopup("Information", {
                    title: "Successfully completed import",
                    description: response.message,
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "refresh",
                        },
                    ],
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.import {
    .upload {
        .uploadBox {
            min-width: 7rem;
            width: max-content;
            max-width: 100%;
            height: 7rem;
            border: 3px dashed var(--bg-color-3);
            margin: 2rem auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 2px;
            box-sizing: border-box;
            overflow: hidden;
            svg {
                font-size: 2rem;
            }
            &[dragging="true"] {
                background: var(--bg-color-2);
                svg,
                p {
                    pointer-events: none;
                }
            }
        }
        input {
            display: none;
        }
    }
}
</style>
