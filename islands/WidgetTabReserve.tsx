import DatePicker from "./DatePicker.tsx";
import { useState } from "preact/hooks";
import TimePicker from "./TimePicker.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import { CHAIR_ICON_SVG } from "../static/svgData.ts";

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
    { selectedChairId, chairData, payload, reservations },
) {
    // エラーメッセージを管理
    const [reserveDateError, setReserveDateError] = useState("");
    const [userError, setUserError] = useState("");

    const chairReservations = reservations.filter(
        (reservation) => reservation.seat_id === selectedChairId,
    );

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
        const startDate = `${event.target.startdate.value}T${event.target.starttime.value}:00`;
        const endDate = `${event.target.enddate.value}T${event.target.endtime.value}:00`;

        // start_date と end_date が一致していないかチェック
        if (startDate === endDate) {
            alert("開始日時と終了日時が一致しています。終了日時を確認してください。");
            return;  // リクエストを中断
        }

        try {
            const requestData = {
                user_id: payload.id, // ユーザーID
                seat_id: selectedChairId, // 選択された席のID
                start_date: startDate,
                end_date: endDate,
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
                const errorData = await response.json();
                throw new Error(errorData.error || "Reservation failed");
            }

            const data = await response.json();
            alert(`予約が成功しました！予約ID: ${data.reservation_id}`);
        } catch (error) {
            console.error("Error during reservation:", error);
            alert(error.message || "予約に失敗しました。もう一度お試しください。");
        }
    } else {
        setReserveDateError(reserveErrorMsg || "");
        setUserError(userCheckErrorMsg || "");
    }
};
    //日付表示
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div class="p-4 sm:p-7">
            <div class="flex items-center space-x-3">
                <div
                    dangerouslySetInnerHTML={{
                        __html: CHAIR_ICON_SVG,
                    }}
                />{" "}
                {selectedChairId !== null && chairData[selectedChairId]
                    ? (
                        <p class="mt-2 text-xl font-bold text-white bg-blue-600 px-4 py-2 rounded-lg shadow-lg">
                            {chairData[selectedChairId]}
                        </p>
                    )
                    : (
                        <p class="mt-2 text-xl font-bold text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg animate-pulse">
                            椅子を選択してください
                        </p>
                    )}
            </div>

            <div class="mt-5">
                <form onSubmit={handleSubmit}>
                    <div class="grid gap-y-4">
                        <div class="flex flex-col">
                            <div class="-m-1.5 overflow-x-auto">
                                <div class="p-1.5 min-w-full inline-block align-middle">
                                    <div class="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                                        <div class="max-h-[200px] overflow-y-auto">
                                            <table class="w-[300px] table-fixed divide-y divide-gray-200 dark:divide-neutral-700">
                                                <thead>
                                                    <tr>
                                                        <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-neutral-400 whitespace-nowrap">
                                                            開始日時
                                                        </th>
                                                        <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-neutral-400 whitespace-nowrap">
                                                            終了日時
                                                        </th>
                                                        <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-neutral-400 whitespace-nowrap">
                                                            ステータス
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                                                    {reservations.sort((a, b) =>
                                                        new Date(a.start_date)
                                                            .getTime() -
                                                        new Date(b.start_date)
                                                            .getTime()
                                                    ).map((
                                                        reservation,
                                                    ) => (
                                                        <tr
                                                            key={reservation.id}
                                                        >
                                                            <td class="px-3 py-2">
                                                                <div class="w-20 h-12 bg-gray-100 dark:bg-neutral-800 rounded-md shadow-sm flex items-center justify-center">
                                                                    <p class="text-xs text-blue-600">
                                                                        {formatDate(
                                                                            reservation
                                                                                .start_date,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td class="px-3 py-2">
                                                                <div class="w-20 h-12 bg-gray-100 dark:bg-neutral-800 rounded-md shadow-sm flex items-center justify-center">
                                                                    <p class="text-xs text-red-600">
                                                                        {formatDate(
                                                                            reservation
                                                                                .end_date,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td class="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                                                                <StatusBadge
                                                                    status={reservation
                                                                        .status}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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
                                        style="width: 292px; resize: none;"
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
