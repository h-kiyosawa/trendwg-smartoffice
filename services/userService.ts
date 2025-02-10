import client from "../db.ts";

// メールアドレスに一致するユーザーデータを取得する
export async function getUserData(email: string) {
    const result = await client.queryArray(
        "SELECT user_id, email, password_hash, name, profile_picture_url FROM users " +
            "WHERE email = '" + email + "'",
    );

    if (result.rows.length > 0) {
        //const [user_id, email, password_hash, name] = result.rows[0];
        const user = result.rows[0];
        return {
            user_id: user[0],
            email: user[1],
            password: user[2],
            name: user[3],
            profile_picture_url: user[4],
        };
    } else {
        return {}; // ユーザーが見つからない場合は空のオブジェクトを返す
    }
}
