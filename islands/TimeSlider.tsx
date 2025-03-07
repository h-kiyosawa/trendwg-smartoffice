import { useEffect, useRef, useState } from "preact/hooks";

export default function TimeSlider({ onTimeChange }) {
    const minTime = 8;
    const maxTime = 22;
    const defaultTime = 9;
    const now = new Date();
    let currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour < minTime) currentHour = minTime;
    if (currentHour > maxTime) currentHour = maxTime;

    const [time, setTime] = useState(currentHour);
    const [selectedDate, setSelectedDate] = useState(
        now.toISOString().split("T")[0],
    );
    const debounceRef = useRef(null);

    useEffect(() => {
        if (onTimeChange) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                // 日付部分を解析
                const [year, month, day] = selectedDate.split("-").map(Number);

                // JST (UTC+9) の時間を計算
                const hours = Math.floor(time);
                const minutes = Math.round((time % 1) * 60);

                // UTC 時間に変換
                const selectedDateTime = new Date(
                    Date.UTC(year, month - 1, day, hours - 9, minutes),
                );

                // ISO 形式でコールバック
                onTimeChange(selectedDateTime.toISOString());
            }, 10); // 10ms 後に実行
        }
    }, [time, selectedDate]);

    const handleChange = (event) => {
        setTime(parseFloat(event.target.value));
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setTime(defaultTime);
    };

    const handleNowClick = () => {
        setSelectedDate(now.toISOString().split("T")[0]);
        setTime(currentHour);
    };

    const getNextWeekDates = () => {
        return [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(now.getDate() + i);
            return date.toISOString().split("T")[0];
        });
    };

    return (
        <div class="flex w-full p-1 relative bg-yellow-100 border border-gray-200 rounded-xl  shadow-sm">
            <div class="flex flex-col items-start mr-4">
                <button
                    class="ml-2 mb-2 p-1.5 text-sm bg-blue-500 text-white font-medium rounded-xl"
                    onClick={handleNowClick}
                >
                    現在日時
                </button>
                <select
                    class="ml-2 p-1.5 text-sm border rounded-xl"
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    {getNextWeekDates().map((date) => (
                        <option key={date} value={date}>
                            {date.slice(5).replace("-", "/")}
                        </option>
                    ))}
                </select>
            </div>
            <div class="flex flex-col items-center w-full relative">
                <span class="text-xl font-medium mb-2">
                    {`${Math.floor(time)}:${(time % 1) * 60 < 10 ? "0" : ""}${
                        Math.round((time % 1) * 60)
                    }`}
                </span>
                <input
                    type="range"
                    min={minTime}
                    max={maxTime}
                    step={0.1667} //10分刻み
                    value={time}
                    onInput={handleChange}
                    class="w-full h-2 bg-gradient-to-r from-orange-200 from- via-indigo-400 via- to-indigo-900 to- rounded-lg appearance-none cursor-pointer  accent-green-600 hover:accent-yellow-400"
                />
            </div>
        </div>
    );
}
