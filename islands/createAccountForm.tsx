import { useState } from "preact/hooks";

// checkEmailを呼び出す
async function callCheckEmail(email: string) {
    const response = await fetch("http://localhost:8000/api/checkEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
    });
    return await response.json();
}

// 入力情報のチェック
const validateUser =async (email: string, password: string, confirmPassword: string) => {
    // パスワードと再入力パスワードの一致チェック
    if (password != confirmPassword) {
      return "パスワードと再入力パスワードが一致していません。";
    }

    // メールアドレスが既にDBに登録されていないことをチェック
    const result = await callCheckEmail(email);
    if (result.result) {
        return "";
    } else {
        return "既に登録されているメールアドレスです。"
    }
}

export default function CreateAccountForm() {
    // エラーメッセージを管理
    const [accountValidateError, setAccountError] = useState("");

    // フォーム送信時の処理
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // エラーメッセージの初期化
        setAccountError("");

        let isValid = true;

        // ユーザー情報のチェック
        const validateResult = await validateUser(
            event.target.email.value,
            event.target.password.value,
            event.target.confirmPassword.value,
        );

        if (validateResult) {
            isValid = false;
        }

        // バリデーションが成功した場合の処理
        if (isValid) {
            try {
                const requestData = {
                    name: event.target.name.value,
                    email: event.target.email.value,
                    password: event.target.password.value,
                }
                const response = await fetch("http://localhost:8000/api/createAccount", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    throw new Error("account create failed");
                } else {
                    // アカウント作成が成功した場合にホームページ(/)に遷移
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 500); // 少し遅延をつけて遷移
                  }
            } catch (error) {
                console.error("error", error);
                //alert('return ctx.render();
            }
        } else {
            setAccountError(validateResult);
        }
    }
    return (
        <div class="flex justify-center items-center p-4 sm:p-7">
            <div class="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
              <h1 class="text-2xl font-bold mb-4 text-center">アカウント登録</h1>
              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="mb-4">
                  <label htmlFor="name" class="block text-sm font-medium text-gray-700">ユーザー名</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="ユーザー名を入力"
                    required
                    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div class="mb-4">
                  <label htmlFor="email" class="block text-sm font-medium text-gray-700">メールアドレス</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@example.com"
                    required
                    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
      
                <div class="mb-4">
                  <label htmlFor="password" class="block text-sm font-medium text-gray-700">パスワード</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="パスワードを入力"
                    required
                    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
      
                <div class="mb-4">
                  <label htmlFor="confirmPassword" class="block text-sm font-medium text-gray-700">パスワード確認</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="パスワードを再入力"
                    required
                    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                {accountValidateError &&
                    (
                        <div
                            class="bg-red-100 text-red-700 px-4 py-2 rounded mt-2"
                            role="alert"
                        >
                            <strong class="font-bold">
                                <p>{accountValidateError}</p>
                            </strong>
                        </div>
                    )
                }
                <button
                  type="submit"
                  class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-yellow-400 focus:outline-none focus:bg-yellow-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                  登録する
                </button>
              </form>
              <div class="text-right py-3 underline">
                <a href="/">オフィスマップに戻る</a>  
              </div>
            </div>
        </div>
      );

}