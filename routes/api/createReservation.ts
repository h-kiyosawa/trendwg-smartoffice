import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // リクエストのボディを取得
        const body = await req.json();

        // 必要なデータを抽出
        const {
            user_id,
            seat_id,
            start_date,
            end_date,
            status,
            remarks,
        } = body;

        // 同じ seat_id で時間が重なっている予約が存在するか確認
        const existingReservation = await client.queryArray(
            "SELECT * FROM reservations WHERE seat_id = $1 AND ((start_date < $2 AND end_date > $2) OR (start_date < $3 AND end_date > $3) OR (start_date >= $2 AND end_date <= $3))",
            [seat_id, start_date, end_date]
        );

        if (existingReservation.rows.length > 0) {
            return new Response(
                JSON.stringify({ error: '既に予約されている時間帯です。' }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // データベースに挿入
        const result = await client.queryArray(
            `INSERT INTO reservations (
                user_id, seat_id, start_date, end_date, status, remarks, reserved_at, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW()
            ) RETURNING reservation_id`,
            [user_id, seat_id, start_date, end_date, status, remarks],
        );

        // 挿入された予約IDを取得
        const reservationId = result.rows[0][0];

        return new Response(
            JSON.stringify({
                message: "Reservation created",
                reservation_id: reservationId,
            }),
            { status: 201, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Error creating reservation:", error);

        return new Response(
            JSON.stringify({ error: "Failed to create reservation" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};