import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return {
    auth: {
      async getUser() {
        if (!token) {
          return { data: { user: null }, error: new Error("No token found") };
        }
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          });
          if (!res.ok) {
            return { data: { user: null }, error: new Error("Unauthorized") };
          }
          const data = await res.json();
          const u = data.user;
          return {
            data: {
              user: u
                ? {
                    id: u._id || u.id,
                    email: u.email,
                    created_at: u.createdAt || new Date().toISOString(),
                  }
                : null,
            },
            error: null,
          };
        } catch (err) {
          return { data: { user: null }, error: err as Error };
        }
      },
      async getSession() {
        const { data } = await this.getUser();
        return { data: { session: data.user ? { user: data.user } : null } };
      },
      async resetPasswordForEmail(email: string, options?: any) {
        return { data: {}, error: null as any };
      },
      async updateUser(attributes: any) {
        return { data: {}, error: null as any };
      },
    },
    from(table: string) {
      const makeQuery = (val: any) => {
        const fetcher = async () => {
          if (table === "user_stats") {
            try {
              const res = await fetch(`${API_URL}/api/user/${val}/stats`, {
                cache: "no-store",
              });
              if (res.ok) {
                const stats = await res.json();
                return { data: stats, error: null };
              }
            } catch (e) {}
          }
          if (table === "quiz_attempts") {
            try {
              const res = await fetch(`${API_URL}/api/user/${val}/history`, {
                cache: "no-store",
              });
              if (res.ok) {
                const attempts = await res.json();
                return { data: attempts, error: null };
              }
            } catch (e) {}
          }
          return { data: [], error: null };
        };

        const chain: any = {
          eq: (f: string, v: any) => makeQuery(v),
          gte: (f: string, v: any) => chain,
          lte: (f: string, v: any) => chain,
          order: (f: string, opts?: any) => chain,
          limit: (n: number) => chain,
          single: () =>
            fetcher().then((res) => ({
              data: Array.isArray(res.data) ? res.data[0] || null : res.data,
              error: res.error,
            })),
          then: (resolve: any) => fetcher().then(resolve),
        };

        return chain;
      };

      return {
        select: (fields?: string) => ({
          eq: (field: string, val: any) => makeQuery(val),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      };
    },
  };
}
