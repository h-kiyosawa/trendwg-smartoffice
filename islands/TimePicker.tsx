import { useEffect, useRef, useState } from "preact/hooks";

const TimePicker = () => {
    // ドロップダウンの開閉状態
    const [isOpen, setIsOpen] = useState(false);
    // 選択された時刻を保持する状態
    const [selectedTime, setSelectedTime] = useState("時間を選択");
    // 時刻リストを保持する状態
    const [timeOptions, setTimeOptions] = useState([]);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // 現在時刻以降の30分刻みの時刻リストを生成する関数
    const generateTimeOptions = () => {
        const options = [];
        const now = new Date();
        now.setMinutes(now.getMinutes() + (30 - now.getMinutes() % 30), 0, 0);

        for (let i = 0; i < 24; i++) { // 最大12時間分
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            options.push(`${hours}:${minutes}`);
            now.setMinutes(now.getMinutes() + 30);
        }
        setTimeOptions(options);
    };

    // 初回レンダリング時に時刻リストを生成
    useEffect(() => {
        generateTimeOptions();
        // 現在時刻をデフォルト値として設定
        const now = new Date();
        const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${
            String(now.getMinutes()).padStart(2, "0")
        }`;
        setSelectedTime(defaultTime);

        // ドロップダウン外をクリックした時に閉じる
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        // イベントリスナーを追加
        document.addEventListener("mousedown", handleClickOutside);

        // コンポーネントアンマウント時にイベントリスナーを削除
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // ドロップダウンの開閉をトグルする関数
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // ドロップダウンの要素をクリックしたときの処理
    const handleSelect = (time) => {
        setSelectedTime(time); // 入力欄に表示する時刻を更新
        setIsOpen(false); // ドロップダウンを閉じる
    };

    // 入力変更時の処理
    const handleInputChange = (event) => {
        setSelectedTime(event.target.value);
    };

    return (
        <div>
            {/* 時刻入力欄 */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={selectedTime}
                    onClick={toggleDropdown}
                    onChange={handleInputChange}
                    className="bg-white rounded-lg text-sm px-4 py-2 text-left inline-flex items-center w-full pr-10" // 時刻文字を左寄せ、右に余白を確保
                    placeholder="時間を選択"
                />
                {/* プルダウン矢印ボタン */}
                <svg
                    onClick={toggleDropdown}
                    className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </div>

            {/* ドロップダウンメニュー */}
            {isOpen && (
                <div
                    id="dropdown"
                    ref={dropdownRef}
                    className="absolute z-10 bg-white divide-y divide-gray-100 font-medium rounded-lg shadow w-44 dark:bg-gray-700"
                    style={{
                        maxHeight: "200px", // 最大高さを設定
                        overflowY: "auto", // 縦のスクロールを有効にする
                    }}
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {/* 時刻リストをループ */}
                        {timeOptions.map((time, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    onClick={() => handleSelect(time)}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    {time}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
