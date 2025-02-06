const statusMap = {
    1: { text: "予約済", color: "bg-blue-400" },
    2: { text: "キャンセル", color: "bg-gray-400" },
    3: { text: "チェックイン済", color: "bg-green-400" },
    4: { text: "チェックアウト", color: "bg-yellow-400" },
    5: { text: "期限切れ", color: "bg-red-400" },
    6: { text: "承認待ち", color: "bg-purple-400" },
    7: { text: "一時予約", color: "bg-orange-400" },
    8: { text: "変更待ち", color: "bg-teal-400" },
    9: { text: "ノーショー", color: "bg-pink-400" },
    10: { text: "強制キャンセル", color: "bg-gray-600" },
    11: { text: "メンテナンス中", color: "bg-black" },
};

const StatusBadge = ({ status }: { status: number }) => {
    const { text, color } = statusMap[status] ||
        { text: "不明", color: "bg-gray-400" };

    return (
        <div
            className={`w-20 h-8 ${color} text-white text-sm font-semibold rounded-md flex items-center justify-center`}
        >
            {text}
        </div>
    );
};

export default StatusBadge;
