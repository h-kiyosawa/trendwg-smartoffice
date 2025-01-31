import {
    computeAesGcmTokenPair,
    computeVerifyAesGcmTokenPair,
  } from "deno_csrf/mod.ts";
  const CSRF_KEY = "01234567012345670123456701234567";

  //const key = Deno.env.get("CSRF_KEY") || "";
  const key = CSRF_KEY || "";
  
  // coockieのcsrf_cookie_token用のトークンを生成
  export function createTokenPair() {
    return computeAesGcmTokenPair(key, 5 * 60);
  }
  
  export function verifyToken(csrfToken: string, csrfCookieToken: string) {
    return computeVerifyAesGcmTokenPair(
      key,
      csrfToken,
      csrfCookieToken,
    );
  }