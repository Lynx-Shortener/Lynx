<template>
    <div class="loader">
        <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
        <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
            :stroke="dark.dark ? '#fff' : '#111'"
        >
            <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                    <circle
                        :stroke-opacity="dark.dark ? 0.5 : 0.2"
                        cx="18"
                        cy="18"
                        r="18"
                    />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
import { useDarkMode } from "../stores/dark";

export default {
    data() {
        return {
            dark: useDarkMode(),
        };
    },
};
</script>
