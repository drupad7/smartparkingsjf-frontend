// client/src/lib/api.ts  (paste over your existing file)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

function joinUrl(base: string, path: string) {
  if (!base) return path; // local dev fallback
  return base.replace(/\/+$/g, "") + "/" + path.replace(/^\/+/g, "");
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const finalUrl = url.startsWith("http") ? url : joinUrl(API_BASE_URL, url);
  const res = await fetch(finalUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // keep session cookies
    mode: "cors",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => import("@tanstack/react-query").QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // queryKey might be ['api', 'users'] or ['/api/users']
    const path = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);
    const finalUrl = path.startsWith("http") ? path : joinUrl(API_BASE_URL, path);

    const res = await fetch(finalUrl, {
      credentials: "include",
      mode: "cors",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
