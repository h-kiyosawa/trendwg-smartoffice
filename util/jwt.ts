import { decodeBase64 } from "$std/encoding/base64.ts";

import * as djwt from "djwt/mod.ts";

const JWT_CRYPTO_KEY = "O6YFIfGzSS4y8djOUAjDYS7fHBbDEMq2FnpG6F9ZWzLXBymW4T2s95FXjWpVzOWwnzQsRhawCyBkfpKiShLNs6fVb8BESkjpdtJrlfOZApIYQs9SI2AWNnxCU4ZpsPtmfayljoNfgIExwxepu2NaWr06LSL9/1KcO86evQ9qDUE=";

//const encodedKey = Deno.env.get("JWT_CRYPTO_KEY") || "";
const encodedKey = JWT_CRYPTO_KEY || "";
const decodedKey = decodeBase64(encodedKey);

const key = await crypto.subtle.importKey(
  "raw",
  decodedKey,
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export async function createJwt(src: Object) {
  // アプリケーションが使用したいペイロードに、検証用途に使用するプロパティをマージ
  const assignedObject = Object.assign(src, {
    jti: crypto.randomUUID(),
    exp: djwt.getNumericDate(3600), // 確認用なのでトークンの有効期間は10秒
  });
  return await djwt.create({ alg: "HS512", typ: "JWT" }, assignedObject, key);
}

export async function inspectAlgorithm(token: string) {
  // ヘッダー内容が想定通りのものか検証する
  // alg を none にする署名回避を防御しておく
  const [header] = await djwt.decode(token, key);
  return header.alg === "HS512" && header.typ === "JWT";
}

export async function getJwtPayload(token: string) {
  return await djwt.verify(token, key);
}