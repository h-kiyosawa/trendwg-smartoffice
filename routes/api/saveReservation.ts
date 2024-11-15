import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
    if (req.method === "POST") {
        const data = await req.json();

        // データベースへの接続と登録処理（例: Deno の SQL ライブラリを使用）
        try {
            const db = await connectToDatabase(); // データベース接続関数
            await db.execute(
                `
                INSERT INTO reservations (email, password, message, startDate, startTime, endDate, endTime, chairId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
                [
                    data.email,
                    data.password,
                    data.message,
                    data.startDate,
                    data.startTime,
                    data.endDate,
                    data.endTime,
                    data.chairId,
                ],
            );

            return new Response("Success", { status: 200 });
        } catch (error) {
            console.error("Database error:", error);
            return new Response("Error", { status: 500 });
        }
    }
    return new Response("Method Not Allowed", { status: 405 });
};
