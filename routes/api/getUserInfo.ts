import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // リクエストからuser_idを取得
        const url = new URL(req.url);
        const userId = url.searchParams.get("user_id");

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "ユーザーIDが提供されていません" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // データベースからユーザー情報を取得
        const user = await client.query(
            `SELECT user_id, name, profile_picture_url, permissions FROM users WHERE user_id = ?`,
            [userId],
        );

        if (!user.length) {
            return new Response(
                JSON.stringify({ error: "ユーザーが見つかりません" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        const userData = user[0];

        // ユーザー情報を返す
        return new Response(
            JSON.stringify({
                id: userData.id,
                name: userData.name,
                profile_picture_url: userData.profile_picture,
                permissions: userData.permissions,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
        return new Response(
            JSON.stringify({ error: "ユーザー情報の取得に失敗しました" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
