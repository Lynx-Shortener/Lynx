<template>
    <div class="export">
        <h2>Select export format</h2>
        <div class="buttons">
            <FormKit type="button"
                     label="JSON"
                     button-type="secondary"
                     @click="exportLinks('json')" />
            <FormKit type="button"
                     label="CSV"
                     button-type="primary"
                     @click="exportLinks('csv')" />
        </div>
    </div>
</template>

<script>
import { useAbout } from "../../stores/about";
import { useLinks } from "../../stores/links";
import { usePopups } from "../../stores/popups";

export default {
    data() {
        return {
            links: useLinks(),
            popups: usePopups(),
            about: useAbout(),
        };
    },
    methods: {
        async exportLinks(format) {
            const response = await this.links.export({
                format,
            });

            if (response.success) {
                const { buffer } = new Uint8Array(response.result.buffer.data);
                const blob = new Blob([buffer]);
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.style = "display: none";
                anchor.href = url;
                document.body.appendChild(anchor);
                anchor.download = response.result.filename;
                anchor.click();
                window.URL.revokeObjectURL(url);
                anchor.remove();
                this.about.track(`Exported Links to ${format.toUpperCase()}`);
                this.popups.closeSelf(this);
            }

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
            }
        },
    },
};
</script>
