import { useEffect } from "preact/hooks";

export default function DatePicker({ id }) {
    useEffect(() => {
        // LitepickerのCSSを動的に読み込む
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/litepicker.css";
        document.head.appendChild(link);

        // Litepickerのスクリプトを動的に読み込む
        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/npm/litepicker/dist/litepicker.js";
        script.onload = () => {
            new window.Litepicker({
                element: document.getElementById(id), // 動的にidを参照
                startDate: new Date(),
                lang: "ja",
            });
        };
        document.head.appendChild(script);
    }, [id]);

    return (
        <div class="relative">
            <input
                class="py-2 pl-4 pr-10 block w-full border-gray-200 rounded-lg text-sm"
                type="text"
                id={id}
                placeholder="Select Date"
            />
            <svg
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-200 dark:text-white cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                />
            </svg>
        </div>
    );
}
