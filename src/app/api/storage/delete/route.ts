import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin";
import { deleteStorageFile, isValidStoragePath } from "@/lib/supabase/storage";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Verify admin authentication ──────────────────────────────────────
    const session = await verifyAdminSession();
    if (!session.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    // ── 2. Parse request body ───────────────────────────────────────────────
    const body = await req.json();
    const { storagePath }: { storagePath: string } = body;

    if (!storagePath || typeof storagePath !== "string") {
      return NextResponse.json(
        { success: false, error: "storagePath is required." },
        { status: 400 }
      );
    }

    // ── 3. Validate path prefix (security guard) ────────────────────────────
    if (!isValidStoragePath(storagePath)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid storage path. Must start with a known folder (products/, categories/, etc.).`,
        },
        { status: 400 }
      );
    }

    // ── 4. Delete from Supabase Storage ────────────────────────────────────
    await deleteStorageFile(storagePath);

    return NextResponse.json({ success: true, deleted: storagePath });
  } catch (error: unknown) {
    console.error("[Supabase Delete] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete file.",
      },
      { status: 500 }
    );
  }
}
