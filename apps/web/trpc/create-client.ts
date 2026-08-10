import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  const baseUrl = env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const apiUrl = baseUrl.endsWith("/trpc") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/trpc`;

  return c({
    url: apiUrl,
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
