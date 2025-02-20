import { signal } from "@preact/signals";

async function callCheckUser(email: string, password: string) {
    const response = await fetch("/api/checkUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
}

async function checkReservation(user_id: string, seat_id: string) {
    try {
        // ✅ クエリパラメータを URL に追加して GET リクエストを送信
        const url =
            `/api/checkReservation?user_id=${user_id}&seat_id=${seat_id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        console.log("checkReservation のレスポンス:", response);

        // ✅ ステータスコードが 400 や 500 の場合、エラーを投げる
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `APIエラー: ${response.status}`);
        }

        // ✅ JSON をパースして返す
        return await response.json();
    } catch (error) {
        console.error("checkReservation のエラー:", error);
        return { status: "error", message: error.message };
    }
}

export default function LoginMobile({ chair_id }: { chair_id: string }) {
    const userValidateError = signal("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        userValidateError.value = "";

        const email = event.target.email.value;
        const password = event.target.password.value;

        console.log("ログイン試行: ", email, password);

        const userResult = await callCheckUser(email, password);

        if (Object.keys(userResult).length === 0) {
            userValidateError.value = "ユーザー情報が間違っています。";
            return;
        }

        try {
            const requestData = {
                user_id: userResult.user_id,
                name: userResult.name,
                profile_picture_url: userResult.profile_picture_url,
                permissions: userResult.permissions,
            };

            const loginApiResponse = await fetch("/api/loginApi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!loginApiResponse.ok) {
                throw new Error("login failed");
            }

            // ✅ 予約の照合を実施
            const reservationResult = await checkReservation(
                userResult.user_id,
                chair_id,
            );

            console.log("予約チェックAPIレスポンス:", reservationResult);

            // ✅ 予約 ID を取得（未予約の場合は undefined）
            const reservationId = reservationResult.reservation_id || "";

            // ✅ 照合結果に応じて遷移先を変更
            switch (reservationResult.status) {
                case "success":
                    window.location.href =
                        `/resultpage?status=success&chair_id=${chair_id}&reservation_id=${reservationId}`;
                    break;
                case "not_reserved":
                    window.location.href =
                        `/resultpage?status=not_reserved&chair_id=${chair_id}`;
                    break;
                case "not_time":
                    window.location.href =
                        `/resultpage?status=not_time&chair_id=${chair_id}`;
                    break;
                case "expired":
                    window.location.href =
                        `/resultpage?status=expired&chair_id=${chair_id}`;
                    break;
                case "already_checked_in":
                    window.location.href =
                        `/resultpage?status=already_checked_in&chair_id=${chair_id}`;
                    break;
                case "error":
                    userValidateError.value =
                        `エラー: ${reservationResult.message}`;
                    break;
                default:
                    userValidateError.value = "不明なエラーが発生しました。";
            }
        } catch (error) {
            console.error("ログインエラー", error);
            userValidateError.value = "ログインに失敗しました。";
        }
    };

    return (
        <div class="p-4 sm:p-7 max-w-md mx-auto">
            <form onSubmit={handleSubmit} class="space-y-4">
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                    >
                        メールアドレス
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@example.com"
                        required
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                    >
                        パスワード
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="パスワードを入力"
                        required
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                {userValidateError.value && (
                    <div
                        class="bg-red-100 text-red-700 px-4 py-2 rounded mt-2"
                        role="alert"
                    >
                        <strong class="font-bold">
                            {userValidateError.value}
                        </strong>
                    </div>
                )}
                <button
                    type="submit"
                    class="w-full py-3 px-4 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-yellow-400"
                >
                    ログイン
                </button>
            </form>
            <div class="text-right mt-4">
                <span>アカウントが未登録ですか？</span>
                <a href="/auth/register" class="underline">アカウントの作成</a>
            </div>
        </div>
    );
}
