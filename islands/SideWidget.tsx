import { useState } from "preact/hooks";
import WidgetTabReserve from "./WidgetTabReserve.tsx";

export default function SideWidget({ selectedChairId, chairData }) {
    const [selectedTab, setSelectedTab] = useState(
        "card-type-tab-preview",
    );

    const handleTabClick = (tabId) => {
        setSelectedTab(tabId);
    };

    return (
        <div>
            <div>
                <nav
                    className="flex gap-x-1"
                    aria-label="Tabs"
                    role="tablist"
                    aria-orientation="horizontal"
                >
                    <button
                        type="button"
                        className={`-mb-px py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center border rounded-t-lg focus:outline-none 
                            ${
                            selectedTab === "card-type-tab-preview"
                                ? "bg-yellow-100 text-blue-600 border-b-transparent"
                                : "bg-gray-50 text-gray-500 hover:text-gray-700"
                        }`}
                        id="card-type-tab-item-1"
                        aria-selected={selectedTab === "card-type-tab-preview"}
                        onClick={() => handleTabClick("card-type-tab-preview")}
                        role="tab"
                    >
                        予約
                    </button>
                    <button
                        type="button"
                        className={`-mb-px py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center border rounded-t-lg focus:outline-none 
                            ${
                            selectedTab === "card-type-tab-2"
                                ? "bg-yellow-100 text-blue-600 border-b-transparent"
                                : "bg-gray-50 text-gray-500 hover:text-gray-700"
                        }`}
                        id="card-type-tab-item-2"
                        aria-selected={selectedTab === "card-type-tab-2"}
                        onClick={() => handleTabClick("card-type-tab-2")}
                        role="tab"
                    >
                        Tab 2
                    </button>
                    <button
                        type="button"
                        className={`-mb-px py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center border rounded-t-lg focus:outline-none 
                            ${
                            selectedTab === "card-type-tab-3"
                                ? "bg-yellow-100 text-blue-600 border-b-transparent"
                                : "bg-gray-50 text-gray-500 hover:text-gray-700"
                        }`}
                        id="card-type-tab-item-3"
                        aria-selected={selectedTab === "card-type-tab-3"}
                        onClick={() => handleTabClick("card-type-tab-3")}
                        role="tab"
                    >
                        Tab 3
                    </button>
                </nav>
            </div>
            <div className="w-96 h-auto bg-yellow-100 border border-gray-200 rounded-xl rounded-tl-none shadow-sm">
                <div
                    id="card-type-tab-preview"
                    role="tabpanel"
                    className={selectedTab === "card-type-tab-preview"
                        ? ""
                        : "hidden"}
                    aria-labelledby="card-type-tab-item-1"
                >
                    {/* タブ1 */}
                    <WidgetTabReserve
                        selectedChairId={selectedChairId}
                        chairData={chairData}
                    />
                </div>
                <div
                    id="card-type-tab-2"
                    role="tabpanel"
                    className={selectedTab === "card-type-tab-2"
                        ? ""
                        : "hidden"}
                    aria-labelledby="card-type-tab-item-2"
                >
                    {/* タブ2 */}
                </div>
                <div
                    id="card-type-tab-3"
                    role="tabpanel"
                    className={selectedTab === "card-type-tab-3"
                        ? ""
                        : "hidden"}
                    aria-labelledby="card-type-tab-item-3"
                >
                    {/* タブ3 */}
                </div>
            </div>
        </div>
    );
}
