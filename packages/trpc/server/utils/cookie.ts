import type { CookieOptions, Response, Request } from "express";
import { TRPCContext } from "../context";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

export function isProductionEnvironment(): boolean {
  const nodeEnv = process.env.NODE_ENV as string | undefined;
  return (
    nodeEnv === "production" ||
    nodeEnv === "prod" ||
    Boolean(process.env.RENDER) ||
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith("https://"))
  );
}

export function getDefaultCookieOptions(): CookieOptions {
  const isProduction = isProductionEnvironment();
  return {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_YEAR,
  };
}

export function createCookieFactory(res: Response) {
  return function createCookie(
    name: string,
    value: string,
    opts?: CookieOptions,
  ) {
    const finalOpts: CookieOptions = {
      ...getDefaultCookieOptions(),
      ...opts,
    };
    res.cookie(name, value, finalOpts);
  };
}

export function getCookieFactory(req: Request) {
  return function getCookie(name: string): string | undefined {
    if (req.cookies && req.cookies[name]) {
      return req.cookies[name];
    }
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return undefined;
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [key, ...v] = c.trim().split("=");
        return [key, v.join("=")];
      })
    );
    return cookies[name];
  };
}

export function clearCookieFactory(res: Response) {
  return function clearCookie(name: string, opts?: CookieOptions) {
    const defaultOpts = getDefaultCookieOptions();
    res.clearCookie(name, {
      path: defaultOpts.path,
      httpOnly: defaultOpts.httpOnly,
      secure: defaultOpts.secure,
      sameSite: defaultOpts.sameSite,
      ...opts,
    });
  };
}

// Authentication Cookie
const AUTHENTICATE_COOKIE_NAME = "authentication-token";

export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string) {
  return ctx.createCookie(AUTHENTICATE_COOKIE_NAME, accessToken);
}
export function getAuthenticationCookie(ctx: TRPCContext) {
  return ctx.getCookie(AUTHENTICATE_COOKIE_NAME);
}
export function clearAuthenticationCookie(ctx: TRPCContext) {
  ctx.clearCookie(AUTHENTICATE_COOKIE_NAME);
}

