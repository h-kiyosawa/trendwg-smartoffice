import { useState } from "preact/hooks";
import Calendar from "./Calendar.tsx";
import HomeButton from "./HomeButton.tsx";

export default function OfficeMap({ mapData, chairData }) {
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedChairId, setSelectedChairId] = useState(null);

    if (!mapData) {
        return <div>Loading...</div>;
    }

    const handleChairClick = (id) => {
        setSelectedChairId(id);
        setCalendarVisible(true);
    };

    const handleHomeClick = () => {
        setSelectedChairId(null);
        setCalendarVisible(false);
    };

    return (
        <>
            <div class="header">
                <HomeButton onClick={handleHomeClick} />
            </div>
            <div class="office-container">
                <div class="office-map">
                    {mapData.chairs.map((chair) => (
                        <div
                            class="chair"
                            style={{ top: chair.y, left: chair.x }}
                            onClick={() => handleChairClick(chair.id)}
                        >
                        </div>
                    ))}
                    {mapData.desks.map((desk) => (
                        <div
                            class="desk"
                            style={{ top: desk.y, left: desk.x }}
                        >
                        </div>
                    ))}
                </div>
                <div class="sidebar">
                    <Calendar isVisible={isCalendarVisible} />
                    {selectedChairId && (
                        <div class="chair-id">
                            Chair ID: {selectedChairId} -{" "}
                            {chairData[selectedChairId]}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
