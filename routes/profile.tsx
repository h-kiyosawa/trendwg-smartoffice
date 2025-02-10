import { Layout } from "./index.tsx";
import ProfileAvatar from "../islands/ProfileAvatar.tsx";
import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getJwtPayload, inspectAlgorithm } from "../util/jwt.ts";

// サーバーサイドで認証情報を取得する
export const handler: Handlers = {
    async GET(req, ctx) {
        try {
            // クッキーからJWTトークンを取得
            const cookies = getCookies(req.headers);
            const jwtToken = cookies.token || "";

            let payload = null;
            if (await inspectAlgorithm(jwtToken)) {
                payload = await getJwtPayload(jwtToken); // JWTを解析してペイロードを取得

                // プロフィール画像がnullまたは空ならデフォルト画像を設定
                if (!payload.profile_picture) {
                    payload.profile_picture =
                        "profile_picture/profile_picture_DEFAULT.jpg";
                }
            }

            // ペイロードをProfileコンポーネントに渡す
            return ctx.render({ payload });
        } catch (error) {
            console.error(error);
            return ctx.render({ payload: null });
        }
    },
};

const Profile = ({ data }) => {
    const { payload } = data;

    if (!payload) {
        return <div>Loading...</div>; // 認証情報がない場合のローディング表示
    }

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">
                        プロフィール更新
                    </h2>
                    {/* Island コンポーネントで動的処理を担当 */}
                    <ProfileAvatar payload={payload} />
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
