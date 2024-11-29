import { getUserData } from "../../services/userService.ts";
import { sha256 } from "../../util/applicationUtils.ts";

// メールアドレス、パスワードが一致するユーザーを検証するAPI
export async function checkUser(email: string, password: string) {
    // メールアドレスと一致するユーザーデータを取得する
    const user = await getUserData(email);
    if (user.password) {
        // パスワードが一致するか検証
        return await checkPassword(user.password, password);
    } else {
        // ユーザーが存在しない
        return false;
    }
  }

// DBのパスワードと入力されたパスワードが一致するか検証する
export async function checkPassword(password: string, enterPassword: string) {
    // 入力されたパスワードをハッシュ化した文字列と
    // DBのハッシュ化されたパスワードが一致していればtrue
    return password == await sha256(enterPassword);    
}