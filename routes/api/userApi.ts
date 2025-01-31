import client from "../../db.ts";
import { getUserData } from "../../services/userService.ts";
import { sha256 } from "../../util/applicationUtils.ts";

// メールアドレス、パスワードが一致するユーザーを検証するAPI
export async function checkUser(email: string, password: string) {
    // メールアドレスと一致するユーザーデータを取得する
    const user = await getUserData(email);
    if (user.password) {
        // パスワードが一致するか検証
        const checkResult = await checkPassword(user.password, password);
        if (checkResult) {
            // ユーザー情報を返す
            return user;
        } else {
            return {};
        }
    } else {
        // ユーザーが存在しない
        return {};
    }
}

// DBのパスワードと入力されたパスワードが一致するか検証する
export async function checkPassword(password: string, enterPassword: string) {
    // 入力されたパスワードをハッシュ化した文字列と
    // DBのハッシュ化されたパスワードが一致していればtrue
    return password == await sha256(enterPassword);    
}


// メールアドレスが既に登録されているか検証するAPI
// 存在しない場合true、存在する場合false
export async function checkEmail(email: string) {
    // メールアドレスと一致するユーザーデータを検索する
    const user = await getUserData(email);
    if (Object.keys(user).length == 0) {
        return { result: true };
    } else {
        return { result: false };
    }
}

// 新規ユーザーアカウントを登録するAPI
export async function createAccount(name: string, email:string , password: string) {
    try {
        // パスワードをハッシュ化する
        const encryptPassword = await sha256(password);
         
        // データベースに挿入
        const result = await client.queryArray(
            `INSERT INTO users (
                email, password_hash, name, status, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, NOW(), NOW()
            ) RETURNING user_id`,
                [email, encryptPassword, name, 1],
        );

        // 挿入されたユーザーIDを取得
        const userId = result.rows[0][0];

        return new Response(
            JSON.stringify({
                message: "account created",
                user_id: userId,
            }),
            { status: 201, headers: { Location: "/"} },
        );
    } catch (error) {
        console.error("Error creating account:", error);

        return new Response(
            JSON.stringify({ error: "Failed to create account" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
