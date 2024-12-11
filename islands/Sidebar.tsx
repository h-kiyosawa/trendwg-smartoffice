import DatePicker from "./DatePicker.tsx";
import { Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import TimePicker from "./TimePicker.tsx";

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

export default function Sidebar(
    { isSidebarVisible, selectedChairId, chairData },
) {
    if (!isSidebarVisible) {
        return null;
    }

    // エラーメッセージを管理
    const [reserveDateError, setReserveDateError] = useState("");
    const [userError, setUserError] = useState("");

    // 予約日のバリデーションチェック
    const validateReserveDate = (
        startdate: string,
        starttime: string,
        enddate: string,
        endtime: string,
    ) => {
        // Date型に変換
        const dateTimeStart = `${startdate}T${starttime}:00`;
        const dateTimeEnd = `${enddate}T${endtime}:00`;
        const dateTimeStartDt = new Date(dateTimeStart);
        const dateTimeEndDt = new Date(dateTimeEnd);

        // 開始日時が終了日時より前
        if (dateTimeStartDt > dateTimeEndDt) {
            return "開始日時は終了日時より過去を指定してください。";
        } else {
            return "";
        }
    };

    // メールアドレス、パスワードが一致するか検証する
    const validateUser = async (email: string, password: string) => {
        const result = await callCheckUser(email, password);
        if (!result) {
            return "ユーザー情報が間違っています。";
        } else {
            return "";
        }
    };

    // フォーム送信時の処理
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // エラーメッセージの初期化
        setReserveDateError("");
        setUserError("");

        let isValid = true;

        // 予約日のチェック
        const reserveErrorMsg = validateReserveDate(
            event.target.startdate.value,
            event.currentTarget[3].value,
            event.target.enddate.value,
            event.currentTarget[5].value,
        );
        if (reserveErrorMsg) {
            isValid = false;
        }

        // メールアドレス、パスワードが一致しているかのチェック
        const userCheckErrorMsg = await validateUser(
            event.target.email.value,
            event.target.password.value,
        );
        if (userCheckErrorMsg) {
            isValid = false;
        }

        // バリデーションが成功した場合の処理
        if (isValid) {
            // 予約処理を行う
        } else {
            setReserveDateError(reserveErrorMsg || "");
            setUserError(userCheckErrorMsg || "");
        }
    };

    return (
        <div class=" bg-yellow-100 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
                        予約
                    </h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                        Chair ID: {selectedChairId} -{" "}
                        {chairData[selectedChairId]}
                    </p>
                </div>

                <div class="mt-5">
                    <button
                        type="button"
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    >
                        <svg
                            class="w-4 h-auto"
                            width="46"
                            height="47"
                            viewBox="0 0 46 47"
                            fill="none"
                        >
                            <path
                                d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                                fill="#4285F4"
                            />
                            <path
                                d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                                fill="#34A853"
                            />
                            <path
                                d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                                fill="#EB4335"
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                        Or
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div class="grid gap-y-4">
                            <div>
                                <label
                                    for="email"
                                    class="block text-sm mb-2 dark:text-white"
                                >
                                    Email address
                                </label>
                                <div class="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        class="py-3 px-4 block w-full border-blue-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        required
                                        aria-describedby="email-error"
                                    />
                                    <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                        <svg
                                            class="size-5 text-red-500"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            aria-hidden="true"
                                        >
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p
                                    class="hidden text-xs text-red-600 mt-2"
                                    id="email-error"
                                >
                                    Please include a valid email address so we
                                    can get back to you
                                </p>
                            </div>
                            <div>
                                <div class="flex justify-between items-center">
                                    <label
                                        for="password"
                                        class="block text-sm mb-2 dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <a
                                        class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                        href="../examples/html/recover-account.html"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div class="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        required
                                        aria-describedby="password-error"
                                    />
                                    <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                        <svg
                                            class="size-5 text-red-500"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            aria-hidden="true"
                                        >
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                        </svg>
                                    </div>
                                </div>
                                {userError &&
                                    (
                                        <div
                                            class="bg-red-100 text-red-700 px-4 py-2 rounded mt-2"
                                            role="alert"
                                        >
                                            <strong class="font-bold">
                                                <p>{userError}</p>
                                            </strong>
                                        </div>
                                    )}
                                <p
                                    class="hidden text-xs text-red-600 mt-2"
                                    id="password-error"
                                >
                                    8+ characters required
                                </p>
                            </div>
                            <div class="flex items-center">
                                <div class="flex">
                                    <svg
                                        class="w-6 h-6 text-green-400 dark:text-white"
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
                                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <div class="ms-3">
                                    <DatePicker id="startdate" />
                                </div>
                                <div class="ms-3">
                                    <TimePicker id="starttime" />
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="flex">
                                    <div class="ms-9">
                                        <DatePicker id="enddate" />
                                    </div>
                                    <div class="ms-3">
                                        <TimePicker />
                                    </div>
                                </div>
                            </div>
                            {reserveDateError &&
                                (
                                    <div
                                        class="bg-red-100 text-red-700 px-4 py-2 rounded mt-2"
                                        role="alert"
                                    >
                                        <strong class="font-bold">
                                            <p>{reserveDateError}</p>
                                        </strong>
                                    </div>
                                )}
                            <div class="flex items-center">
                                <div class="flex">
                                    <svg
                                        class="w-6 h-6 text-green-400 dark:text-white"
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
                                            stroke-width="2"
                                            d="M5 7h14M5 12h14M5 17h10"
                                        />
                                    </svg>
                                    <div class="flex flex-col space-y-2 ms-3">
                                        <textarea
                                            id="message"
                                            class="border-gray-200 rounded-lg text-sm p-2 resize-y"
                                            rows="6"
                                            placeholder="備考を入力してください"
                                        >
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-yellow-400 focus:outline-none focus:bg-yellow-500 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                予約する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
