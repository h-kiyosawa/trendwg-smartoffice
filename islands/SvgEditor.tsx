import { useEffect, useRef, useState } from "preact/hooks";

export default function SvgEditor() {
    const svgRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [hoveredElement, setHoveredElement] = useState(null);
    const [chairId, setChairId] = useState("");
    const [chairName, setChairName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMapRegisterOpen, setIsMapRegisterOpen] = useState(false);
    const [mapName, setMapName] = useState("");
    const [chairs, setChairs] = useState([]);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const originalStyles = useRef(new Map());

    useEffect(() => {
        if (svgRef.current && chairs.length > 0) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgContent, "image/svg+xml");

            chairs.forEach((chair) => {
                const targetChair = doc.querySelector([id = "${chair.id}"]);
                if (targetChair) {
                    targetChair.setAttribute("chairname", chair.chairname);
                }
            });

            setSvgContent(new XMLSerializer().serializeToString(doc));
        }
    }, [chairs]);

    const reloadSvg = () => {
        setSvgContent((prev) => prev); // Force re-render
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = (e) => setSvgContent(e.target.result);
            reader.readAsText(file);
        }
    };

    const handleElementClick = (event) => {
        const element = event.target;
        if (element.tagName !== "svg") {
            setSelectedElement(element);
            setChairId(element.getAttribute("id") || "");
            setChairName(element.getAttribute("chairname") || "");
            setIsDialogOpen(true);
        }
    };

    const handleElementMouseOver = (event) => {
        const element = event.target;
        if (element.tagName !== "svg") {
            setHoveredElement({
                id: element.getAttribute("id") || "未設定",
                name: element.getAttribute("chairname") || "未設定",
            });
        }
    };

    const handleElementMouseOut = () => {
        setHoveredElement(null);
    };

    const handleSaveChairId = () => {
        if (selectedElement) {
            selectedElement.setAttribute("type", "chair");
            selectedElement.setAttribute("id", chairId);
            selectedElement.setAttribute("chairname", chairName);
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgContent, "image/svg+xml");
            const targetChair = doc.querySelector(`[id='${chairId}']`);
            if (targetChair) {
                targetChair.setAttribute("chairname", chairName);
                setSvgContent(new XMLSerializer().serializeToString(doc));
            }
        }
        setIsDialogOpen(false);
    };

    const handleChairNameChange = (index, newName) => {
        setChairs((prevChairs) => {
            const updatedChairs = [...prevChairs]; // 配列をコピー
            updatedChairs[index] = {
                ...updatedChairs[index],
                chairname: newName,
            }; // 該当の要素を更新
            return updatedChairs; // 更新された配列を setChairs に渡す
        });
    };

    const handleDownload = () => {
        if (!svgRef.current) return;
        const svgData = svgRef.current.innerHTML;
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "edited_map.svg";
        a.click();
    };

    const handleWriteAndClose = () => {
        if (!svgContent) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, "image/svg+xml");

        chairs.forEach((chair) => {
            const targetChair = doc.querySelector(`[id="${chair.id}"]`);
            if (targetChair) {
                targetChair.setAttribute("chairname", chair.chairname);
            }
        });

        setSvgContent(new XMLSerializer().serializeToString(doc));
        setIsMapRegisterOpen(false);
    };

    const handleMapRegister = () => {
        if (!svgRef.current) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(
            svgRef.current.innerHTML,
            "image/svg+xml",
        );

        const chairElements = doc.querySelectorAll('[type="chair"]');
        const extractedChairs = Array.from(chairElements).map((chair) => ({
            id: chair.getAttribute("id"),
            chairname: chair.getAttribute("chairname"),
        }));
        setChairs(extractedChairs);
        setIsMapRegisterOpen(true);
    };

    const handleRegisterMap = async () => {
        const response = await fetch("/api/registerMap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                map_name: mapName,
                map_data: svgContent,
                chairs: chairs.map((chair) => ({
                    id: chair.id,
                    chairname: chair.chairname,
                    seat_type: 1,
                    properties: {},
                })),
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("マップが登録されました");
            setIsMapRegisterOpen(false);
        } else {
            alert("登録エラー: " + result.error);
        }
        reloadSvg();
    };

    const handleWheel = (event) => {
        event.preventDefault();

        const zoomFactor = 0.1;
        const delta = event.deltaY;

        const rect = document.getElementById("mapContainer")
            .getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        let newScale = scale + (delta > 0 ? -zoomFactor : zoomFactor);
        newScale = Math.max(0.5, Math.min(newScale, 3));

        const scaleRatio = newScale / scale;
        const newOffsetX = mouseX - (mouseX - offset.x) * scaleRatio;
        const newOffsetY = mouseY - (mouseY - offset.y) * scaleRatio;

        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleMouseDown = (event) => {
        setIsPanning(true);
        setStartPan({
            x: event.clientX - offset.x,
            y: event.clientY - offset.y,
        });
    };

    const handleMouseMove = (event) => {
        if (!isPanning) return;
        setOffset({
            x: event.clientX - startPan.x,
            y: event.clientY - startPan.y,
        });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    return (
        <div class="flex">
            <div class="w-48 h-20 border p-2 bg-gray-100">
                <p>マウスオーバー情報</p>
                <p>椅子ID: {hoveredElement ? hoveredElement.id : "なし"}</p>
                <p>椅子名: {hoveredElement ? hoveredElement.name : "なし"}</p>
            </div>
            <div class="flex flex-col items-center">
                <input
                    type="file"
                    accept=".svg"
                    onChange={handleImport}
                    class="mb-4"
                />
                <div
                    id="mapContainer"
                    class="relative w-[1100px] h-[700px] border-2 border-gray-400 overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <div
                        ref={svgRef}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        class="w-full h-full cursor-pointer"
                        onClick={handleElementClick}
                        onMouseOver={handleElementMouseOver}
                        onMouseOut={handleElementMouseOut}
                        style={{
                            cursor: isPanning ? "grabbing" : "grab",
                            transform:
                                `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                            transformOrigin: "0 0",
                            transition: "transform 0.1s ease-out",
                        }}
                    />
                </div>
                <div class="flex gap-2 mt-2">
                    <button
                        onClick={handleMapRegister}
                        class="mt-4 p-2 bg-green-500 text-white rounded"
                    >
                        マップ登録
                    </button>
                    <button
                        onClick={handleDownload}
                        class="mt-4 p-2 bg-blue-500 text-white rounded"
                    >
                        ダウンロード
                    </button>
                </div>
                {isDialogOpen && (
                    <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div class="bg-white p-4 rounded shadow-lg">
                            <label>椅子ID:</label>
                            <input
                                type="text"
                                value={chairId}
                                onChange={(e) => setChairId(e.target.value)}
                                class="border p-1"
                            />
                            <label class="ml-4">椅子名:</label>
                            <input
                                type="text"
                                value={chairName}
                                onChange={(e) => setChairName(e.target.value)}
                                class="border p-1"
                            />
                            <button
                                onClick={handleSaveChairId}
                                class="ml-2 bg-green-500 text-white p-1 rounded"
                            >
                                OK
                            </button>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                class="ml-2 bg-red-500 text-white p-1 rounded"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}
                {isMapRegisterOpen && (
                    <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div class="bg-white p-4 rounded shadow-lg max-w-[90vw] max-h-[80vh] overflow-auto">
                            <label>マップ名:</label>
                            <input
                                type="text"
                                value={mapName}
                                onChange={(e) => setMapName(e.target.value)}
                                class="border p-1"
                            />
                            <p class="mt-2">登録する椅子一覧:</p>
                            <ul class="max-h-[50vh] overflow-auto border p-2">
                                {chairs.sort((a, b) => a.id - b.id).map((
                                    chair,
                                    index,
                                ) => (
                                    <li
                                        key={chair.id}
                                        class="flex items-center gap-2"
                                    >
                                        <span>{chair.id} -</span>
                                        <input
                                            type="text"
                                            value={chair.chairname}
                                            onChange={(e) =>
                                                handleChairNameChange(
                                                    index,
                                                    e.target.value,
                                                )}
                                            class="border p-1"
                                        />
                                        <button
                                            onClick={() => {
                                                // `id` を持つ要素から `type="chair"` を削除
                                                const parser = new DOMParser();
                                                const doc = parser
                                                    .parseFromString(
                                                        svgContent,
                                                        "image/svg+xml",
                                                    );
                                                const targetChair = doc
                                                    .querySelector(
                                                        `[id="${chair.id}"]`,
                                                    );
                                                if (targetChair) {
                                                    targetChair.removeAttribute(
                                                        "type",
                                                    );
                                                    targetChair.removeAttribute(
                                                        "id",
                                                    );
                                                }
                                                setSvgContent(
                                                    new XMLSerializer()
                                                        .serializeToString(doc),
                                                );

                                                // リストから削除
                                                setChairs(
                                                    chairs.filter((c) =>
                                                        c.id !== chair.id
                                                    ),
                                                );
                                            }}
                                            class="text-red-500 ml-2"
                                        >
                                            🗑
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleRegisterMap}
                                class="mt-2 bg-green-500 text-white p-1 rounded"
                            >
                                登録
                            </button>
                            <button
                                onClick={handleWriteAndClose}
                                class="ml-2 bg-yellow-500 text-white p-1 rounded"
                            >
                                SVGに書きこんで戻る
                            </button>
                            <button
                                onClick={() => setIsMapRegisterOpen(false)}
                                class="ml-2 bg-red-500 text-white p-1 rounded"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
