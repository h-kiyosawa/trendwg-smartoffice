import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // クエリパラメータの取得
        const url = new URL(req.url);
        const userId = url.searchParams.get("user_id") || undefined;
        const seatId = url.searchParams.get("seat_id") || undefined;

        if (!userId || !seatId) {
            return new Response(
                JSON.stringify({ error: "Missing user_id or seat_id" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // 予約情報を取得
        let query = `
            SELECT reservation_id, status, start_date, end_date
            FROM reservations
            WHERE user_id = $1 AND seat_id = $2 
            AND status IN (1, 3) -- 1: reserved, 3: checked-in-wait
            ORDER BY start_date DESC
            LIMIT 1
        `;
        const params: (string | number)[] = [userId, seatId];

        const result = await client.queryObject({
            text: query,
            args: params,
        });

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ status: "not_reserved" }), {
                status: 200,
            });
        }

        const reservation = result.rows[0];
        const currentTime = new Date();
        const startTime = new Date(reservation.start_date);
        const endTime = new Date(reservation.end_date);

        let responseStatus = "unknown";

        if (reservation.status === 1 && currentTime < startTime) {
            responseStatus = "not_time";
        } else if (
            reservation.status === 1 && currentTime >= startTime &&
            currentTime <= endTime
        ) {
            responseStatus = "success";
        } else if (
            reservation.status === 3 && currentTime >= startTime &&
            currentTime <= endTime
        ) {
            responseStatus = "success";
        } else if (reservation.status === 1 && currentTime > endTime) {
            responseStatus = "expired";
        } else if (reservation.status === 4) {
            responseStatus = "already_checked_in";
        }

        return new Response(
            JSON.stringify({
                status: responseStatus,
                reservation_id: reservation.reservation_id, // reservation_id を追加
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Error checking reservation:", error);

        return new Response(
            JSON.stringify({ error: "Failed to check reservation" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
