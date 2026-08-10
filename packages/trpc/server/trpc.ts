import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async options => {
  const { ctx } = options;

  let userToken = getAuthenticationCookie(ctx);
  if (!userToken && ctx.req?.headers?.authorization) {
    const authHeader = ctx.req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      userToken = authHeader.substring(7);
    } else {
      userToken = authHeader;
    }
  }

  if (!userToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not Logged in",
    });
  }

  try {
    const { id } = await userService.verifyAndDecodeUserToken(userToken);

    return options.next({
      ctx: {
        user: { id },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired authentication token",
    });
  }
});
