/**
 * Supabase Storage — server-side utilities.
 * This file must ONLY be imported in server components, server actions, and API routes.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// ── Environment validation ────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// ── Service-role admin client (server-only) ───────────────────────────────────

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );
  }
  return _adminClient;
}

// ── Allowed MIME types ────────────────────────────────────────────────────────

export type AllowedMimeType = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export function validateFileType(contentType: string): contentType is AllowedMimeType {
  return ALLOWED_MIME_TYPES.includes(contentType as AllowedMimeType);
}

function mimeToExtension(contentType: AllowedMimeType): string {
  const map: Record<AllowedMimeType, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  return map[contentType] ?? "webp";
}

// ── Folder / storage path ─────────────────────────────────────────────────────

export type StorageFolder =
  | "products"
  | "categories"
  | "collections"
  | "banners"
  | "general";

/** Default Supabase Storage bucket name. Create this in your Supabase dashboard. */
export const STORAGE_BUCKET = "loomloft-media";

/**
 * Generates a unique, safe storage path.
 * Pattern: {folder}/{entityId}/{uuid}.{ext}  or  {folder}/{uuid}.{ext}
 */
export function generateStoragePath(
  folder: StorageFolder,
  contentType: AllowedMimeType,
  entityId?: string
): string {
  const ext = mimeToExtension(contentType);
  const uuid = randomUUID();
  if (
    entityId &&
    (folder === "products" || folder === "categories" || folder === "collections")
  ) {
    const safeId = entityId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
    return `${folder}/${safeId}/${uuid}.${ext}`;
  }
  return `${folder}/${uuid}.${ext}`;
}

/** Validates that a storage path is safe to delete (must start with a known folder). */
export function isValidStoragePath(storagePath: string): boolean {
  if (typeof storagePath !== "string" || storagePath.length < 5) return false;
  const allowed = ["products/", "categories/", "collections/", "banners/", "general/"];
  return allowed.some((prefix) => storagePath.startsWith(prefix));
}

// ── Public URL ────────────────────────────────────────────────────────────────

/**
 * Builds the public URL for a file in Supabase Storage.
 * Requires the bucket to have public access enabled.
 */
export function getPublicStorageUrl(storagePath: string): string {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

// ── Presigned upload URL ──────────────────────────────────────────────────────

export interface PresignResult {
  presignedUrl: string;
  storagePath: string;
  publicUrl: string;
  token: string;
  expiresIn: number;
}

/**
 * Generates a short-lived presigned upload URL using Supabase Storage.
 * The browser uploads directly — service-role key never leaves the server.
 */
export async function generatePresignedUploadUrl(
  storagePath: string,
  expiresIn = 600 // 10 minutes
): Promise<PresignResult> {
  const admin = getSupabaseAdminClient();

  const { data, error } = await admin.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (error || !data) {
    throw new Error(`Supabase presign error: ${error?.message ?? "unknown"}`);
  }

  return {
    presignedUrl: data.signedUrl,
    storagePath,
    publicUrl: getPublicStorageUrl(storagePath),
    token: data.token,
    expiresIn,
  };
}

// ── Delete object ─────────────────────────────────────────────────────────────

/**
 * Deletes a single file from Supabase Storage.
 * Always validates the storage path before proceeding.
 */
export async function deleteStorageFile(storagePath: string): Promise<void> {
  if (!isValidStoragePath(storagePath)) {
    throw new Error(
      `Invalid storage path: "${storagePath}". Must start with a known folder.`
    );
  }

  const admin = getSupabaseAdminClient();
  const { error } = await admin.storage.from(STORAGE_BUCKET).remove([storagePath]);

  if (error) {
    throw new Error(`Supabase delete error: ${error.message}`);
  }
}

// ── File existence check ──────────────────────────────────────────────────────

export async function storageFileExists(storagePath: string): Promise<boolean> {
  try {
    const admin = getSupabaseAdminClient();
    const folder = storagePath.substring(0, storagePath.lastIndexOf("/"));
    const filename = storagePath.substring(storagePath.lastIndexOf("/") + 1);
    const { data } = await admin.storage.from(STORAGE_BUCKET).list(folder);
    return (data ?? []).some((f) => f.name === filename);
  } catch {
    return false;
  }
}
