import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // クエリパラメータの取得
        const url = new URL(req.url);
        const userId = url.searchParams.get("user_id") || undefined;
        const seatId = url.searchParams.get("seat_id") || undefined;
        const startDate = url.searchParams.get("start_date") || undefined;
        const endDate = url.searchParams.get("end_date") || undefined;

        // SQLクエリの構築
        let query =
            `SELECT reservation_id, user_id, seat_id, start_date, end_date, status, remarks, reserved_at 
                     FROM reservations WHERE 1=1`;
        const params: (string | number)[] = [];

        if (userId) {
            query += ` AND user_id = $${params.length + 1}`;
            params.push(userId);
        }
        if (seatId) {
            query += ` AND seat_id = $${params.length + 1}`;
            params.push(seatId);
        }
        if (startDate) {
            query += ` AND start_date >= $${params.length + 1}`;
            params.push(startDate);
        }
        if (endDate) {
            query += ` AND end_date <= $${params.length + 1}`;
            params.push(endDate);
        }

        // データベースから予約を取得
        const result = await client.queryObject({
            text: query,
            args: params,
        });

        return new Response(
            JSON.stringify({ reservations: result.rows }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Error fetching reservations:", error);

        return new Response(
            JSON.stringify({ error: "Failed to fetch reservations" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
