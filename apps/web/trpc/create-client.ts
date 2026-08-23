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
    headers() {
      if (typeof window !== "undefined") {
        let token = localStorage.getItem("blockform_auth_token");
        if (!token) {
          try {
            const params = new URLSearchParams(window.location.search);
            token = params.get("token");
          } catch {
            // ignore SSR/parsing error
          }
        }
        if (token) {
          return {
            Authorization: `Bearer ${token}`,
          };
        }
      }
      return {};
    },
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};

