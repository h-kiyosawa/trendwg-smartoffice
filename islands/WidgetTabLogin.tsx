import { useState } from "preact/hooks";

// checkUser メソッドを呼び出すための関数
async function callCheckUser(email: string, password: string) {
    const response = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
}

export default function WidgetTabLogin({ payload }) {
    // エラーメッセージを管理
    const [userValidateError, setUserError] = useState("");

    // メールアドレス、パスワードが一致するか検証する
    const validateUser = async (email: string, password: string) => {
        const result = await callCheckUser(email, password);
        return result;
    };

    // フォーム送信時の処理
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // エラーメッセージの初期化
        setUserError("");

        let isValid = true;
        // ユーザー情報のチェック
        const userResult = await validateUser(
            event.target.email.value,
            event.target.password.value,
        );
        if (Object.keys(userResult).length == 0) {
            isValid = false;
        }

        if (isValid) {
            try {
                const requestData = {
                    user_id: userResult.user_id,
                    name: userResult.name,
                    profile_picture_url: userResult.profile_picture_url,
                };

                const loginApiResponse = await fetch("/api/loginApi", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });

                const response = new Response("", {
                    status: 303,
                    headers: { Location: "/" },
                });

                if (!loginApiResponse.ok) {
                    throw new Error("login failed");
                } else {
                    window.location.href = "/";
                }
            } catch (error) {
                console.error("error", error);
            }
        } else {
            setUserError("ユーザー情報が間違っています。");
        }
    };
    if (!payload) {
        return (
            <div class="p-4 sm:p-7">
                <div class="mt-5">
                    <form onSubmit={handleSubmit}>
                        <div class="mb-4">
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

                        <div class="mb-6">
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
                        {userValidateError &&
                            (
                                <div
                                    class="bg-red-100 text-red-700 px-4 py-2 rounded mt-2"
                                    role="alert"
                                >
                                    <strong class="font-bold">
                                        <p>{userValidateError}</p>
                                    </strong>
                                </div>
                            )}
                        <div class="grid gap-y-4">
                            <button
                                type="submit"
                                class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-yellow-400 focus:outline-none focus:bg-yellow-500 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                ログイン
                            </button>
                        </div>
                    </form>
                    <div class="text-right">
                        <label>
                            アカウントが未登録ですか？
                        </label>
                        <a href="/auth/register" class="underline">
                            アカウントの作成
                        </a>
                    </div>
                </div>
            </div>
        );
    } else {
        <div class="p-4 sm:p-7">
            <div class="mt-5">
                ログインしています。
            </div>
        </div>;
    }
}
