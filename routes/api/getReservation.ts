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
        const status = url.searchParams.get("status") || undefined;

        // SQLクエリの構築
        let query = `SELECT 
                reservations.reservation_id, 
                reservations.user_id, 
                reservations.seat_id, 
                reservations.start_date, 
                reservations.end_date, 
                reservations.status, 
                reservations.remarks, 
                reservations.reserved_at, 
                users.email, 
                users.name, 
                users.profile_picture_url,
                users.status AS user_status, 
                users.created_at AS user_created_at, 
                users.updated_at AS user_updated_at 
             FROM reservations
             LEFT JOIN users ON reservations.user_id = users.user_id
             WHERE 1=1`;

        const params: (string | number)[] = [];

        if (userId) {
            query += ` AND reservations.user_id = $${params.length + 1}`;
            params.push(userId);
        }
        if (seatId) {
            query += ` AND reservations.seat_id = $${params.length + 1}`;
            params.push(seatId);
        }
        if (startDate) {
            query += ` AND reservations.start_date >= $${params.length + 1}`;
            params.push(startDate);
        }
        if (endDate) {
            query += ` AND reservations.end_date <= $${params.length + 1}`;
            params.push(endDate);
        }
        if (status) {
            query += ` AND reservations.status = $${params.length + 1}`;
            params.push(status);
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
