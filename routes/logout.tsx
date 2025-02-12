// routes/logout.tsx
import { HandlerContext } from '$fresh/server.ts';
import { setCookie } from "$std/http/cookie.ts";

export const handler = (_req: Request, _ctx: HandlerContext) => {
    // ログアウト処理をここに記述

    const response = new Response("", {
      status: 303,
      headers: { Location: "/" },
    });
    setCookie(response.headers, {
        name: "token",
        value: "",
        path: "/",
        maxAge: 0,
        secure: false,
        httpOnly: false,
    });

    return response;
};

export default function Logout() {
  return <div>ログアウト中...</div>;
}