import { checkEmail } from "./userApi.ts";

// メールアドレスを検証するAPIをリクエスト
export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "POST") {
    const { email } = await req.json();
    const result = await checkEmail(email);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // メソッドがPOSTでない場合はエラーレスポンス
  return new Response("Method Not Allowed", { status: 405 });
};