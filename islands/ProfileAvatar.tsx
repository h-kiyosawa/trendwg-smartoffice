import { useRef, useState } from "preact/hooks";
import { asset } from "$fresh/runtime.ts";

const ProfileAvatar = ({ payload }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [preview, setPreview] = useState(null); // プレビュー画像
    const [selectedFile, setSelectedFile] = useState(null); // アップロードする画像
    const [userName, setUserName] = useState(payload.name); // ユーザーネーム
    const [isChanged, setIsChanged] = useState(false); // 変更があったかを判定
    const [updatedProfile, setUpdatedProfile] = useState(payload); // 更新されたプロフィールデータ
    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        setShowMenu(!showMenu);
    };

    // 画像を選択したとき
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file); // 一時保存

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result); // プレビュー表示
            setIsChanged(true); // 変更フラグON
        };
        reader.readAsDataURL(file);
    };

    // ユーザーネーム変更時
    const handleNameChange = (event) => {
        setUserName(event.target.value);
        setIsChanged(true); // 変更フラグON
    };

    // プロフィール情報を再取得
    const fetchUpdatedProfile = async () => {
        try {
            const response = await fetch("/api/getProfile", {
                method: "GET",
                credentials: "include",
            });

            const result = await response.json();
            if (response.ok) {
                setUpdatedProfile(result.profile); // 新しいプロフィールをセット
                setUserName(result.profile.name); // 新しいユーザーネームをセット
                setPreview(`/static/${result.profile.profile_picture}`); // 新しいプロフィール画像をセット
            } else {
                console.error("Failed to fetch updated profile:", result.error);
            }
        } catch (error) {
            console.error("Error fetching updated profile:", error);
        }
    };

    // 「プロフィールを更新」ボタンが押されたとき
    const handleProfileUpdate = async () => {
        if (!isChanged) return alert("変更がありません。");

        const formData = new FormData();
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        formData.append("name", userName);

        try {
            const response = await fetch("/api/updateProfile", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await response.json();
            if (response.ok) {
                setIsChanged(false); // 変更フラグをリセット
                alert("プロフィールを更新しました！");
                setUpdatedProfile(result.profile); // 最新のプロフィール情報で状態を更新
                setUserName(result.profile.name); // 新しいユーザーネームをセット
                setPreview(`/static/${result.profile.profile_picture}`); // 新しい画像をセット

                // 新しいトークンをクッキーに保存（`credentials: "include"`により自動的に保存されます）
                if (result.token) {
                    document.cookie =
                        `token=${result.token}; Path=/; Max-Age=3600`; // 必要に応じて設定
                }
            } else {
                console.error("Update failed:", result.error);
                alert("プロフィールの更新に失敗しました。");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("エラーが発生しました。");
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* プロフィール画像 */}
            <img
                src={preview || asset(`/${updatedProfile.profile_picture}`)}
                alt="User Avatar"
                className="w-32 h-32 rounded-full cursor-pointer hover:opacity-80 border border-gray-400"
                onClick={handleIconClick}
            />
            {/* メニュー（アイコンをクリックで表示） */}
            {showMenu && (
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-48 bg-white shadow-lg rounded-lg">
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => fileInputRef.current.click()}
                    >
                        写真をアップロード
                    </button>
                </div>
            )}
            {/* 非表示のファイル入力 */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* ユーザーネーム編集 */}
            <input
                type="text"
                value={userName}
                onChange={handleNameChange}
                className="mt-4 px-4 py-2 border border-gray-300 rounded text-center"
            />

            {/* プロフィールを更新ボタン（変更があった場合のみ表示） */}
            {isChanged && (
                <button
                    onClick={handleProfileUpdate}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    プロフィールを更新
                </button>
            )}
        </div>
    );
};

export default ProfileAvatar;
