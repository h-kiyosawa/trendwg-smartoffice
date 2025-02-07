import { useEffect, useRef, useState } from "preact/hooks";
import MapSelector from "./MapSelector.tsx";
import SideWidget from "./SideWidget.tsx";
import { NOMAP_DINO_SVG } from "../static/svgData.ts";

export default function OfficeMap({ mapData, chairData, payload }) {
    const [selectedChairId, setSelectedChairId] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [selectedMap, setSelectedMap] = useState(null);
    const [allReservations, setAllReservations] = useState(new Map());

    // **初回にステータスを更新し、チェックイン前の全予約データを取得**
    useEffect(() => {
        const fetchAndUpdateReservations = async () => {
            try {
                // status=1で予約を取得
                const response = await fetch(`/api/getReservation?status=1`);
                if (!response.ok) {
                    throw new Error("Failed to fetch reservations");
                }

                const data = await response.json();
                const reservationsToUpdate = [];

                // 現在時刻を取得
                const now = new Date();

                // 取得した予約の終了時刻が過去のものをチェックし、ステータスを更新
                data.reservations.forEach((reservation) => {
                    const endDate = new Date(reservation.end_date);
                    if (endDate < now) {
                        reservationsToUpdate.push(reservation.reservation_id); // 更新対象の予約IDを収集
                    }
                });

                // ステータスを更新するAPIリクエスト
                if (reservationsToUpdate.length > 0) {
                    const updateResponse = await fetch(
                        "/api/updateReservation",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                reservationIds: reservationsToUpdate,
                                newStatus: 5,
                            }),
                        },
                    );

                    if (!updateResponse.ok) {
                        throw new Error(
                            "Failed to update reservation statuses",
                        );
                    }
                }

                // 更新後、再度予約データを取得
                const updatedResponse = await fetch(
                    `/api/getReservation?status=1`,
                );
                if (!updatedResponse.ok) {
                    throw new Error("Failed to fetch updated reservations");
                }

                const updatedData = await updatedResponse.json();
                const reservationsMap = new Map();

                updatedData.reservations.forEach((res) => {
                    if (!reservationsMap.has(res.seat_id)) {
                        reservationsMap.set(res.seat_id, []);
                    }
                    reservationsMap.get(res.seat_id).push(res);
                });

                setAllReservations(reservationsMap);
            } catch (error) {
                console.error(
                    "Error fetching and updating reservations:",
                    error,
                );
            }
        };

        fetchAndUpdateReservations();
    }, []); // 初回レンダリング時に実行

    // クリック時にキャッシュから取得
    const handleChairClick = (id) => {
        setSelectedChairId(id);
        setReservations(allReservations.get(id) || []);
    };

    const handleMapSelect = (selectedMapData) => {
        setSelectedMap(selectedMapData);
    };

    if (!mapData) {
        return <div>Loading...</div>;
    }

    //メインページ要素の位置はここで調整
    return (
        <div class="office-container flex flex-row justify-center items-stretch min-h-screen mt-10 pl-40">
            <div class="widgettabreserve mr-4 h-full">
                <SideWidget
                    selectedChairId={selectedChairId}
                    chairData={chairData}
                    payload={payload}
                    reservations={reservations}
                />
            </div>

            {/* MapSelector & SvgComponent を縦並び & 伸縮可能に */}
            <div class="flex flex-col h-full flex-grow">
                <MapSelector mapData={mapData} onSelect={handleMapSelect} />
                <div id="mapContainer" class="mapbody mt-5 flex-grow">
                    <SvgComponent
                        handleChairClick={handleChairClick}
                        selectedMap={selectedMap}
                    />
                </div>
            </div>
        </div>
    );
}

const SvgComponent = ({ handleChairClick, selectedMap }) => {
    const svgRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [highlightedChairId, setHighlightedChairId] = useState(null); // ハイライト対象の状態を管理

    useEffect(() => {
        const svgElement = svgRef.current;

        if (!svgElement || !selectedMap) return;

        // SVGを設定する
        svgElement.innerHTML = selectedMap.data; // selectedMap.dataがSVGのコンテンツ
    }, [selectedMap]); // selectedMapが変わったときに再実行

    const handleChairElementClick = (element) => {
        const chairId = Number(element.id); // SVG要素のidを取得
        handleChairClick(chairId); // 親コンポーネントのhandleChairClickを呼び出す
        setHighlightedChairId(chairId); // ハイライト対象を更新
    };

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const targetElements = svgElement.querySelectorAll('[type="chair"]');

        // クリックイベントハンドラー
        const handleClick = (event) => {
            const element = event.currentTarget;
            handleChairElementClick(element);
        };

        // 既存のイベントリスナーを削除
        targetElements.forEach((element) => {
            element.removeEventListener("click", handleClick);
        });

        // ホバークラスを適用
        targetElements.forEach((el) => {
            el.classList.add(
                "hover:fill-red-500",
                "transition-colors",
                "duration-300",
                "cursor-pointer",
            );
        });

        // クリックイベントリスナーを追加
        targetElements.forEach((element) => {
            element.addEventListener("click", handleClick);
        });

        return () => {
            // クリーンアップ時にリスナーを削除
            targetElements.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
        };
    }, [selectedMap]); // selectedMap が変更されたときのみ実行

    useEffect(() => {
        const svgElement = svgRef.current;

        if (!svgElement) return;

        // 特定の条件に合うSVG要素を取得
        const targetElements = svgElement.querySelectorAll('[type="chair"]');

        // 他の要素のハイライトをリセット
        targetElements.forEach((el) => {
            el.classList.remove(
                "fill-green-500",
                "stroke-blue-500",
                "stroke-2",
            );
        });

        // ハイライト対象の要素にスタイルを適用
        if (highlightedChairId !== null) {
            const targetElement = svgElement.querySelector(
                `[id="${highlightedChairId}"]`,
            );
            if (targetElement) {
                targetElement.classList.add(
                    "fill-green-500",
                    "stroke-blue-500",
                    "stroke-2",
                );
            }
        }
    }, [highlightedChairId]); // ハイライトが変わったときに実行

    const handleWheel = (event) => {
        event.preventDefault();

        const zoomFactor = 0.1;
        const delta = event.deltaY;

        // マウスポインタの座標を取得
        const rect = document.getElementById("mapContainer")
            .getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // マウスのX座標 (相対)
        const mouseY = event.clientY - rect.top; // マウスのY座標 (相対)

        // 新しいスケールを計算
        let newScale = scale + (delta > 0 ? -zoomFactor : zoomFactor);
        newScale = Math.max(0.5, Math.min(newScale, 3)); // 最小・最大ズーム制限

        // ズームに合わせてオフセットを調整
        const scaleRatio = newScale / scale;
        const newOffsetX = mouseX - (mouseX - offset.x) * scaleRatio;
        const newOffsetY = mouseY - (mouseY - offset.y) * scaleRatio;

        // 新しいスケールとオフセットを設定
        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleMouseDown = (event) => {
        const startX = event.clientX - offset.x;
        const startY = event.clientY - offset.y;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            setOffset({ x: dx, y: dy });
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div class="window-container relative overflow-hidden w-[1100px] h-[700px] border-4 border-solid border-green-400">
            <div
                ref={svgRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                style={{
                    cursor: "grab",
                    transform:
                        `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: "0 0", // 左上を基準にズーム
                    transition: "transform 0.1s ease-out",
                }}
                class="absolute"
            >
                {/* 初期SVG */}
                <div dangerouslySetInnerHTML={{ __html: NOMAP_DINO_SVG }} />
            </div>
        </div>
    );
};
