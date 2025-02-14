import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // リクエストボディの取得
        const body = await req.json();
        const { map_name, map_data, chairs } = body;

        if (!map_name || !map_data || !chairs) {
            return new Response(
                JSON.stringify({
                    error: "マップ名, データ, 椅子情報は必須です。",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // `map_name` の重複チェック
        const existingMap = await client.queryArray(
            "SELECT map_id FROM maps WHERE map_name = $1",
            [map_name],
        );
        if (existingMap.rowCount > 0) {
            return new Response(
                JSON.stringify({ error: "同じ名前のマップが既に存在します。" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // `maps` テーブルに `map_data` を挿入
        const insertMapResult = await client.queryArray(
            "INSERT INTO maps (map_name, map_data, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING map_id",
            [map_name, map_data],
        );
        const map_id = insertMapResult.rows[0][0];

        // `chairs` の `id` 重複チェック
        const seenIds = new Set();
        for (const chair of chairs) {
            if (seenIds.has(chair.id)) {
                return new Response(
                    JSON.stringify({
                        error: `ID ${chair.id} が重複しています。`,
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }
            seenIds.add(chair.id);
        }

        // `seats` テーブルにデータを挿入
        for (const chair of chairs) {
            await client.queryArray(
                "INSERT INTO seats (seat_id, map_id, seat_name, seat_type, properties, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())",
                [chair.id, map_id, chair.chairname, 1, "{}"],
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "マップ登録が完了しました。",
            }),
            { status: 201, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Error in registerMap:", error);
        return new Response(
            JSON.stringify({ error: "サーバーエラーが発生しました。" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
