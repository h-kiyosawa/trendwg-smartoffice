import { getJwtPayload } from "../../util/jwt.ts"; // jwt.tsのverifyJwtなどを使ってトークンを検証
import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // クッキーからトークンを取得
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("=")[1]; // ここでcookie名が'token'と仮定

        if (!token) {
            return new Response(
                JSON.stringify({ error: "トークンが提供されていません" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // トークンの検証とデコード
        const payload = await getJwtPayload(token);

        if (!payload) {
            return new Response(
                JSON.stringify({ error: "無効なトークンです" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // ユーザー情報を返す
        return new Response(
            JSON.stringify({
                id: payload.id,
                name: payload.name,
                profile_picture_url: payload.profile_picture,
                permissions: payload.permissions,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("プロフィール取得エラー:", error);

        return new Response(
            JSON.stringify({ error: "プロフィール取得に失敗しました" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
