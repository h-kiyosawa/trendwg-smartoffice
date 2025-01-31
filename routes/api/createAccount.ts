import { createAccount } from "./userApi.ts";

// アカウントを作成するAPIをリクエスト
export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();
    const result = await createAccount(name, email, password);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // メソッドがPOSTでない場合はエラーレスポンス
  return new Response("Method Not Allowed", { status: 405 });
};