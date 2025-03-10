import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // クエリパラメータの取得
        const url = new URL(req.url);
        const seatId = url.searchParams.get("seat_id") || undefined;

        // SQLクエリの構築
        let query = `SELECT 
                        seats.seat_id, 
                        seats.properties 
                     FROM seats
                     WHERE 1=1`;

        const params: (string | number)[] = [];

        if (seatId) {
            query += ` AND seats.seat_id = $${params.length + 1}`;
            params.push(seatId);
        }

        // データベースから座席情報を取得
        const result = await client.queryObject({
            text: query,
            args: params,
        });

        if (result.rows.length === 0) {
            return new Response(
                JSON.stringify({ error: "Seat not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // レスポンスの返却
        return new Response(
            JSON.stringify({ seat: result.rows[0] }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Error fetching seat properties:", error);

        return new Response(
            JSON.stringify({ error: "Failed to fetch seat properties" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
