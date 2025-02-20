import { setCookie } from "$std/http/cookie.ts";
import { createJwt } from "../../util/jwt.ts";
import { HandlerContext } from "$fresh/server.ts";

interface User {
    id: number;
    name: string;
    profile_picture_url: string;
    permissions: string;
}

export const handler = async (req: Request, _ctx: HandlerContext) => {
    try {
        // リクエストのボディを取得
        const body = await req.json();

        // 必要なデータを抽出
        const {
            user_id,
            name,
            profile_picture_url,
            permissions,
        } = body;
        const user = {
            id: user_id,
            name: name,
            profile_picture: profile_picture_url,
            permissions: permissions,
        };

        const response = new Response("", {
            status: 303,
            headers: { Location: "/" },
        });
        setCookie(response.headers, {
            name: "token",
            value: await createJwt(user),
            path: "/",
            secure: false,
            httpOnly: false,
        });

        response.headers.set("Location", "/"); // ホームページにリダイレクト

        return response;
    } catch (error) {
        console.error("Error creating reservation:", error);

        return new Response(
            JSON.stringify({ error: "Failed to create reservation" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
