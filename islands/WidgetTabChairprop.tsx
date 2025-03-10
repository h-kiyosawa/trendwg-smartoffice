import { useEffect, useState } from "preact/hooks";
import { CHAIR_ICON_SVG } from "../static/svgData.ts";

type MonitorInfo = {
    size: number; // モニターサイズ（インチ）
    resolution: string; // 解像度（例: "1920x1080"）
};

interface SeatProperties {
    monitor?: boolean;
    monitors?: MonitorInfo[];
    power_tap?: boolean;
    chair_type?: string;
    usb_ports?: number;
    usb_c_ports?: number;
    wired_lan?: boolean;
    phone_booth?: boolean;
    near_window?: boolean;
    aircon_direct?: boolean;
    sunlight?: boolean;
    remarks?: string;
}

const propertyNames: { [key: string]: string } = {
    monitor: "モニター",
    monitors: "モニター詳細",
    power_tap: "コンセント",
    chair_type: "椅子タイプ",
    usb_ports: "USB-Aポート",
    usb_c_ports: "USB-Cポート",
    wired_lan: "有線LAN",
    phone_booth: "通話ブース",
    near_window: "窓際",
    aircon_direct: "エアコン直風",
    sunlight: "日当たり",
    remarks: "備考",
};

interface Seat {
    id: number;
    properties: Record<string, any>;
}

interface Props {
    selectedChairId: number;
    chairData: Record<number, string>;
}

export default function ({ selectedChairId, chairData }: Props) {
    const [properties, setProperties] = useState<Seat["properties"] | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProperties, setEditedProperties] = useState(null);

    useEffect(() => {
        if (!selectedChairId) return;
        setLoading(true);
        setError(null);

        fetch(`/api/getSeatProperties?seat_id=${selectedChairId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setProperties(null);
                } else {
                    setProperties(data.seat.properties);
                }
            })
            .catch(() => setError("データ取得に失敗しました"))
            .finally(() => setLoading(false));
    }, [selectedChairId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProperties(properties);
    };

    const handleSave = async () => {
        const response = await fetch("/api/updateSeatProperties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                seat_id: selectedChairId,
                properties: editedProperties,
            }),
        });
        if (response.ok) {
            setProperties(editedProperties);
            setIsEditing(false);
        } else {
            setError("保存に失敗しました");
        }
    };

    const handleChange = (key: string, value: any) => {
        setEditedProperties((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleAddMonitor = () => {
        const newMonitor: MonitorInfo = {
            size: 24,
            resolution: "1920x1080",
        };
        setEditedProperties((prev: any) => ({
            ...prev,
            monitors: [...(prev.monitors || []), newMonitor],
        }));
    };

    return (
        <div class="p-4 sm:p-7">
            <div class="flex items-center space-x-3">
                <div dangerouslySetInnerHTML={{ __html: CHAIR_ICON_SVG }} />
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
                <div class="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                    <div class="max-h-[540px] overflow-y-auto">
                        <table class="w-[300px] table-fixed divide-gray-200 dark:divide-neutral-700">
                            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                                {Object.keys(propertyNames).map((
                                    key,
                                    index,
                                ) => (
                                    <tr key={index}>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                            {propertyNames[key]}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                            {isEditing
                                                ? (
                                                    key === "monitors"
                                                        ? (
                                                            <>
                                                                {properties
                                                                    ?.monitors
                                                                    ?.map((
                                                                        monitor,
                                                                        i,
                                                                    ) => (
                                                                        <div
                                                                            key={i}
                                                                            class="mb-2"
                                                                        >
                                                                            <div>
                                                                                サイズ:
                                                                                <br />
                                                                                <input
                                                                                    type="number"
                                                                                    value={monitor
                                                                                        .size}
                                                                                    onInput={(
                                                                                        e,
                                                                                    ) => {
                                                                                        const newMonitors =
                                                                                            [
                                                                                                ...(editedProperties
                                                                                                    .monitors ||
                                                                                                    []),
                                                                                            ];
                                                                                        newMonitors[
                                                                                            i
                                                                                        ].size =
                                                                                            parseInt(
                                                                                                e.currentTarget
                                                                                                    .value,
                                                                                            );
                                                                                        handleChange(
                                                                                            "monitors",
                                                                                            newMonitors,
                                                                                        );
                                                                                    }}
                                                                                    class="input"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                解像度:
                                                                                <br />
                                                                                <input
                                                                                    type="text"
                                                                                    value={monitor
                                                                                        .resolution}
                                                                                    onInput={(
                                                                                        e,
                                                                                    ) => {
                                                                                        const newMonitors =
                                                                                            [
                                                                                                ...(editedProperties
                                                                                                    .monitors ||
                                                                                                    []),
                                                                                            ];
                                                                                        newMonitors[
                                                                                            i
                                                                                        ].resolution =
                                                                                            e.currentTarget
                                                                                                .value;
                                                                                        handleChange(
                                                                                            "monitors",
                                                                                            newMonitors,
                                                                                        );
                                                                                    }}
                                                                                    class="input"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                <button
                                                                    onClick={handleAddMonitor}
                                                                    class="bg-blue-500 text-white px-2 py-1 rounded"
                                                                >
                                                                    ＋
                                                                </button>
                                                            </>
                                                        )
                                                        : typeof properties[
                                                                key
                                                            ] === "boolean"
                                                        ? (
                                                            <select
                                                                value={properties[
                                                                        key
                                                                    ]
                                                                    ? "〇"
                                                                    : "✕"}
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        key,
                                                                        e.currentTarget
                                                                            .value ===
                                                                            "〇",
                                                                    )}
                                                                class="input"
                                                            >
                                                                <option value="〇">
                                                                    〇
                                                                </option>
                                                                <option value="✕">
                                                                    ✕
                                                                </option>
                                                            </select>
                                                        )
                                                        : typeof properties[
                                                                key
                                                            ] === "number"
                                                        ? (
                                                            <select
                                                                value={properties[
                                                                    key
                                                                ] || 1}
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        key,
                                                                        parseInt(
                                                                            e.currentTarget
                                                                                .value,
                                                                        ),
                                                                    )}
                                                                class="input"
                                                            >
                                                                {Array.from(
                                                                    {
                                                                        length:
                                                                            10,
                                                                    },
                                                                    (_, i) => (
                                                                        <option
                                                                            key={i}
                                                                            value={i +
                                                                                1}
                                                                        >
                                                                            {i +
                                                                                1}
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        )
                                                        : (
                                                            <input
                                                                type="text"
                                                                value={properties[
                                                                    key
                                                                ] || ""}
                                                                onInput={(e) =>
                                                                    handleChange(
                                                                        key,
                                                                        e.currentTarget
                                                                            .value,
                                                                    )}
                                                                class="input"
                                                            />
                                                        )
                                                )
                                                : (
                                                    properties &&
                                                        key in properties
                                                        ? Array.isArray(
                                                                properties[key],
                                                            )
                                                            ? properties[key]
                                                                    .length > 0
                                                                ? properties[
                                                                    key
                                                                ].map((
                                                                    item,
                                                                    i,
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                    >
                                                                        {key ===
                                                                                "monitors"
                                                                            ? (
                                                                                <>
                                                                                    サイズ:
                                                                                    {" "}
                                                                                    {item
                                                                                        .size}インチ
                                                                                    <br />
                                                                                    解像度:
                                                                                    {" "}
                                                                                    {item
                                                                                        .resolution}
                                                                                </>
                                                                            )
                                                                            : JSON
                                                                                .stringify(
                                                                                    item,
                                                                                )}
                                                                    </div>
                                                                ))
                                                                : "なし"
                                                            : key === "remarks"
                                                            ? properties.remarks
                                                                .split(
                                                                    /(.{10})/,
                                                                ).filter(
                                                                    Boolean,
                                                                ).map((
                                                                    line,
                                                                    index,
                                                                ) => (
                                                                    <span
                                                                        key={index}
                                                                    >
                                                                        {line}
                                                                        <br />
                                                                    </span>
                                                                ))
                                                            : typeof properties[
                                                                    key
                                                                ] === "boolean"
                                                            ? properties[key]
                                                                ? "〇"
                                                                : "✕"
                                                            : properties[key]
                                                                ?.toString() ||
                                                                "不明"
                                                        : "-"
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="mt-3 flex space-x-3 ">
                {isEditing
                    ? (
                        <>
                            <button
                                type="submit"
                                class="inline-flex items-center justify-center space-x-2 border border-transparent text-sm font-medium rounded-full w-10 h-10 text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                                onClick={handleCancel}
                            >
                                <svg
                                    class="w-6 h-6 text-white dark:text-white"
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
                                        d="M6 18 17.94 6M18 18 6.06 6"
                                    />
                                </svg>
                            </button>
                            <button
                                type="submit"
                                class="inline-flex items-center justify-center space-x-2 border border-transparent text-sm font-medium rounded-full w-10 h-10 text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                onClick={handleSave}
                            >
                                <svg
                                    class="w-6 h-6 text-white dark:text-white"
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
                                        d="M5 11.917 9.724 16.5 19 7.5"
                                    />
                                </svg>
                            </button>
                        </>
                    )
                    : (
                        <button
                            type="submit"
                            class="inline-flex items-center justify-center space-x-2 border border-transparent text-sm font-medium rounded-full w-10 h-10 text-white bg-green-600 hover:bg-green-700 transition-colors"
                            onClick={handleEdit}
                        >
                            <svg
                                class="w-5 h-5 text-white dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                                    clip-rule="evenodd"
                                />
                                <path
                                    fill-rule="evenodd"
                                    d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
            </div>
        </div>
    );
}
