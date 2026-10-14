import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    // Verify Admin Credentials (loomloft2026@gmail.com / Admin@2026)
    if (cleanEmail === "loomloft2026@gmail.com" && cleanPassword === "Admin@2026") {
      const cookieStore = await cookies();
      const sessionData = {
        userId: "admin-curator-01",
        email: cleanEmail,
        name: "Master Guild Curator",
        role: "ADMIN",
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      };

      const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

      cookieStore.set("loomloft_admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: {
          id: sessionData.userId,
          email: sessionData.email,
          name: sessionData.name,
          role: "ADMIN",
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid admin credentials. Access denied." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
