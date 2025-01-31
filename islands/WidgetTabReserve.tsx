import DatePicker from "./DatePicker.tsx";
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

export default function WidgetTabReserve(
    { selectedChairId, chairData, reservations },
) {
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
            event.target.starttime.value,
            event.target.enddate.value,
            event.target.endtime.value,
        );
        if (reserveErrorMsg) {
            isValid = false;
        }

        // バリデーションが成功した場合の処理
        if (isValid) {
            try {
                const requestData = {
                    user_id: 1, // ユーザーID
                    seat_id: selectedChairId, // 選択された席のID
                    start_date:
                        `${event.target.startdate.value}T${event.target.starttime.value}:00`,
                    end_date:
                        `${event.target.enddate.value}T${event.target.endtime.value}:00`,
                    status: 1, // 状態
                    remarks: event.target.message.value, // 備考
                };

                const response = await fetch("/api/createReservation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    throw new Error("Reservation failed");
                }

                const data = await response.json();
                alert(`予約が成功しました！予約ID: ${data.reservation_id}`);
            } catch (error) {
                console.error("Error during reservation:", error);
                alert("予約に失敗しました。もう一度お試しください。");
            }
        } else {
            setReserveDateError(reserveErrorMsg || "");
            setUserError(userCheckErrorMsg || "");
        }
    };

    return (
        <div class="p-4 sm:p-7">
            <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
                    予約
                </h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                    Chair ID: {selectedChairId} - {chairData[selectedChairId]}
                </p>
            </div>

            <div class="mt-5">
                <form onSubmit={handleSubmit}>
                    <div class="grid gap-y-4">
                        <div class="flex flex-col">
                            <div class="-m-1.5 overflow-x-auto">
                                <div class="p-1.5 min-w-full inline-block align-middle">
                                    <div class="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                                        <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                            <thead>
                                                <tr>
                                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-neutral-400">
                                                        開始日時
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-neutral-400">
                                                        終了日時
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-neutral-400">
                                                        状態
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                                                {reservations.map((
                                                    reservation,
                                                ) => (
                                                    <tr key={reservation.id}>
                                                        <td class="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                                                            {new Date(
                                                                reservation
                                                                    .start_date,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td class="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                                                            {new Date(
                                                                reservation
                                                                    .end_date,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td class="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                                                            {reservation.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
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
                                <DatePicker id="startdate" name="startdate" />
                            </div>
                            <div class="ms-3">
                                <TimePicker id="starttime" name="starttime" />
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="flex">
                                <div class="ms-9">
                                    <DatePicker id="enddate" name="enddate" />
                                </div>
                                <div class="ms-3">
                                    <TimePicker id="endtime" name="endtime" />
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
    );
}
