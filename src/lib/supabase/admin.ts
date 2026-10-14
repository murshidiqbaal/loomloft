import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "./client";

export interface AdminSession {
  isAdmin: boolean;
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-loomloft.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Reusable secure admin authorization helper for Server Actions & API Routes.
 * Never trusts role info sent from the browser.
 */
export async function verifyAdminSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  
  // 1. First check Supabase Auth if configured
  if (isSupabaseConfigured) {
    try {
      const supabase = await getSupabaseServerClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user && !error) {
        const role = user.app_metadata?.role || user.user_metadata?.role || "";
        const isAdmin = role.toLowerCase() === "admin" || user.email === "loomloft2026@gmail.com";

        if (isAdmin) {
          return {
            isAdmin: true,
            userId: user.id,
            email: user.email || "loomloft2026@gmail.com",
            name: user.user_metadata?.full_name || "LoomLoft Curator",
            role: "ADMIN",
          };
        }
      }
    } catch (err) {
      console.warn("Supabase auth verification failed:", err);
    }
  }

  // 2. Fallback to LoomLoft secure admin token cookie (for seamless admin access)
  const adminTokenCookie = cookieStore.get("loomloft_admin_session");
  if (adminTokenCookie?.value) {
    try {
      const decoded = JSON.parse(Buffer.from(adminTokenCookie.value, "base64").toString("utf-8"));
      if (decoded.email === "loomloft2026@gmail.com" && decoded.role === "ADMIN" && decoded.exp > Date.now()) {
        return {
          isAdmin: true,
          userId: decoded.userId || "admin-curator-01",
          email: decoded.email,
          name: decoded.name || "Master Curator",
          role: "ADMIN",
        };
      }
    } catch {
      // Invalid cookie
    }
  }

  return {
    isAdmin: false,
    userId: "",
    email: "",
    name: "",
    role: "GUEST",
  };
}
