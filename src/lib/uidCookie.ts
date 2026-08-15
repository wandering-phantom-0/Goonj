import { randomUUID } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const UID_COOKIE_NAME = "goonj_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

export function getUid(req: NextRequest): string {
  return req.cookies.get(UID_COOKIE_NAME)?.value ?? randomUUID();
}

export function setUidCookie(res: NextResponse, uid: string) {
  res.cookies.set(UID_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
