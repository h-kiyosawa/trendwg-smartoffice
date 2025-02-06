import { HandlerContext } from "$fresh/server.ts";
import client from "../../db.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // リクエストのボディを取得
        const { reservationIds, newStatus } = await req.json();

        if (
            !reservationIds || !Array.isArray(reservationIds) ||
            reservationIds.length === 0
        ) {
            return new Response(
                JSON.stringify({ error: "No reservation IDs provided" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // SQLクエリの構築
        const query = `
            UPDATE reservations
            SET status = $1
            WHERE reservation_id = ANY($2::int[])
        `;
        const params = [newStatus, reservationIds];

        // データベースでステータスを更新
        await client.queryObject({
            text: query,
            args: params,
        });

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Error updating reservation statuses:", error);

        return new Response(
            JSON.stringify({ error: "Failed to update reservation statuses" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
