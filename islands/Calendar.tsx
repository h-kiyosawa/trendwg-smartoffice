import { useState } from "preact/hooks";

export default function Calendar({ isVisible }) {
    if (!isVisible) {
        return null;
    }

    return (
        <div class="calendar">
            <h2>予約ダイアログ</h2>
            {/* カレンダーの内容をここに追加 */}
        </div>
    );
}
