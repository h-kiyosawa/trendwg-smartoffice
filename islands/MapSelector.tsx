import { useEffect, useRef, useState } from "preact/hooks";

const MapSelector = ({ mapData, onSelect }) => {
    // ドロップダウンの開閉状態
    const [isOpen, setIsOpen] = useState(false);
    // 選択されたマップを保持する状態
    const [selectedMap, setSelectedMap] = useState("マップを選択");
    // ドロップダウンのDOM参照を行うhook
    const dropdownRef = useRef(null);

    // ドロップダウンの開閉をトグルする関数
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // ドロップダウンの要素をクリックしたときの処理
    const handleSelect = (id, name) => {
        setSelectedMap(name); // ボタンに表示する名前を更新
        onSelect(mapData[id]); // 選択された mapData を返す
        setIsOpen(false); // ドロップダウンを閉じる
    };

    // 初回レンダリング時にドロップダウンの動作を設定する
    useEffect(() => {
        // ドロップダウン外をクリックした時に閉じる
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
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

    return (
        <div>
            {/* ドロップダウンボタン */}
            <button
                id="dropdownDefaultButton"
                onClick={toggleDropdown}
                className="text-white bg-green-600 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                {selectedMap} 🦕
                <svg
                    className="w-2.5 h-2.5 ms-3"
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
            </button>

            {/* ドロップダウンメニュー */}
            {isOpen && (
                <div
                    id="dropdown"
                    ref={dropdownRef}
                    className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {/* Object.entries()を使ってmapDataをループ */}
                        {Object.entries(mapData).map(([id, { name }]) => (
                            <li key={id}>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleSelect(id, name)}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    {name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapSelector;
