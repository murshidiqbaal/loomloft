import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin";
import {
  generatePresignedUploadUrl,
  generateStoragePath,
  validateFileType,
  type StorageFolder,
  type AllowedMimeType,
} from "@/lib/supabase/storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

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
    const {
      contentType,
      folder = "products",
      entityId,
      fileSizeHint,
    }: {
      contentType: string;
      folder?: StorageFolder;
      entityId?: string;
      fileSizeHint?: number;
    } = body;

    // ── 3. Validate contentType ─────────────────────────────────────────────
    if (!contentType || !validateFileType(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid content type: "${contentType}". Allowed: image/jpeg, image/png, image/webp, image/avif.`,
        },
        { status: 400 }
      );
    }

    // ── 4. Validate file size hint ──────────────────────────────────────────
    if (fileSizeHint !== undefined && fileSizeHint > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size ${(fileSizeHint / 1024 / 1024).toFixed(1)} MB exceeds the 10 MB limit.`,
        },
        { status: 400 }
      );
    }

    // ── 5. Validate folder ──────────────────────────────────────────────────
    const allowedFolders: StorageFolder[] = [
      "products",
      "categories",
      "collections",
      "banners",
      "general",
    ];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, error: `Invalid folder: "${folder}".` },
        { status: 400 }
      );
    }

    // ── 6. Generate unique storage path ─────────────────────────────────────
    const storagePath = generateStoragePath(folder, contentType as AllowedMimeType, entityId);

    // ── 7. Generate presigned URL (expires in 10 minutes) ───────────────────
    const result = await generatePresignedUploadUrl(storagePath, 600);

    return NextResponse.json({
      success: true,
      presignedUrl: result.presignedUrl,
      storagePath: result.storagePath,
      publicUrl: result.publicUrl,
      token: result.token,
      expiresIn: result.expiresIn,
    });
  } catch (error: unknown) {
    console.error("[Supabase Presign] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate upload URL.",
      },
      { status: 500 }
    );
  }
}
