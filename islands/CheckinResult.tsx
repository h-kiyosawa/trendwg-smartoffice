import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function CheckinResult() {
    const message = signal("処理中です...");
    const chairId = signal("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get("status");
            chairId.value = urlParams.get("chair_id") || "";
            const reservationId = urlParams.get("reservation_id"); // 予約IDを取得

            if (status === "success") {
                updateReservationStatus(reservationId, 4); // ステータス 4 (チェックイン済) に更新
            } else {
                setStatusMessage(status);
            }
        }
    }, []);

    async function updateReservationStatus(
        reservationId: string,
        newStatus: number,
    ) {
        try {
            const response = await fetch("/api/updateReservation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reservationIds: [reservationId],
                    newStatus: newStatus,
                    chairId: chairId.value,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("予約ステータス更新失敗:", errorText);
                message.value = `⚠️ 予約更新に失敗しました: ${errorText}`;
                return;
            }

            // 更新成功時のメッセージ
            message.value =
                `✅ チェックインが完了しました！（席番号: ${chairId.value}）`;
        } catch (error) {
            console.error("予約ステータス更新エラー:", error);
            message.value = "⚠️ 予約の更新中にエラーが発生しました。";
        }
    }

    function setStatusMessage(status: string | null) {
        switch (status) {
            case "not_reserved":
                message.value = "⚠️ 予約が見つかりませんでした。";
                break;
            case "not_time":
                message.value = "⏳ まだ利用開始時間ではありません。";
                break;
            case "expired":
                message.value = "⏳ 予約の時間が過ぎています。";
                break;
            case "already_checked_in":
                message.value = "✅ すでにチェックイン済みです。";
                break;
            default:
                message.value = "⚠️ 不明なステータスです。";
        }
    }

    return (
        <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <p class="text-lg font-semibold">{message}</p>
                <a href="/" class="mt-4 block text-blue-500 hover:underline">
                    トップページへ戻る
                </a>
            </div>
        </div>
    );
}
