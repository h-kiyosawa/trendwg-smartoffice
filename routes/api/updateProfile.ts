import { ensureDir } from "https://deno.land/std@0.171.0/fs/mod.ts";
import client from "../../db.ts";
import { getCookies } from "$std/http/cookie.ts";
import { createJwt, verifyJwt } from "../../util/jwt.ts"; // createJwt をインポート

export const handler = async (req: Request) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    // JWT からユーザー情報を取得
    const cookies = getCookies(req.headers);
    const token = cookies.token;
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers,
        });
    }

    const userData = await verifyJwt(token);
    if (!userData) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
            status: 401,
            headers,
        });
    }

    // マルチパートフォームデータの処理
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
        return new Response(JSON.stringify({ error: "Invalid content type" }), {
            status: 400,
            headers,
        });
    }

    const formData = await req.formData();
    const userName = formData.get("name")?.toString() || "";
    const file = formData.get("file");

    let profilePicture = userData.profile_picture; // デフォルトは現在の画像

    if (file && file instanceof File) {
        const ext = file.name.split(".").pop();
        const filePath = `static/profile_picture/${userData.id}.${ext}`;

        await ensureDir("static/profile_picture"); // ディレクトリ作成
        const fileData = await file.arrayBuffer();
        await Deno.writeFile(filePath, new Uint8Array(fileData));

        profilePicture = `profile_picture/${userData.id}.${ext}`;
    }

    // ユーザー情報を更新
    await client.queryArray(
        `UPDATE users SET name = $1, profile_picture_url = $2, updated_at = NOW() WHERE user_id = $3`,
        [userName, profilePicture, userData.id],
    );

    const updatedUser = await client.queryObject<
        { user_id: number; name: string; profile_picture_url: string }
    >`
    SELECT user_id, name, profile_picture_url, updated_at
    FROM users
    WHERE user_id = ${userData.id}
`;

    // updatedUser.rows に結果が格納されているので、それを使って情報を取得
    const userFromDb = updatedUser.rows[0]; // 最初の行を取得

    if (!userFromDb) {
        throw new Error("User not found");
    }

    // レスポンスボディに基づいて user オブジェクトを作成
    const user = {
        id: userFromDb.user_id,
        name: userFromDb.name,
        profile_picture: userFromDb.profile_picture_url,
    };

    // 新しいJWTを生成
    const newToken = await createJwt(user);

    // 新しいトークンをクッキーにセット（期限なども設定可能）
    headers.set(
        "Set-Cookie",
        `token=${newToken}; HttpOnly; Path=/; Max-Age=3600`,
    );

    return new Response(
        JSON.stringify({
            message: "Profile updated",
            profile: updatedUser, // 最新のプロフィール情報を返す
            token: newToken, // 新しいトークンも返す
        }),
        { status: 200, headers },
    );
};
