import { toHashString } from "https://deno.land/std@0.188.0/crypto/to_hash_string.ts";

// 文字列をハッシュ化する
export async function sha256(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return toHashString(digest); 
}