import { checkUser } from "./checkUserApi.ts";

// メールアドレスとパスワードの一致を検証するAPIをリクエスト
export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "POST") {
    const { email, password } = await req.json();
    const result = await checkUser(email, password);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // メソッドがPOSTでない場合はエラーレスポンス
  return new Response("Method Not Allowed", { status: 405 });
};