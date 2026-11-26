"use client";

import React, { useState, useRef, useCallback, useId } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
  GripVertical,
  RotateCcw,
  ImageOff,
} from "lucide-react";
import { convertFileToWebP } from "@/lib/client-image-converter";

// ── Types ─────────────────────────────────────────────────────────────────────

type UploadStatus = "idle" | "converting" | "uploading" | "done" | "error";

export interface StorageImageEntry {
  /** Locally-generated ID for UI keying */
  localId: string;
  /** File the user chose — only present until upload completes */
  file?: File;
  /** Blob URL for client-side preview */
  previewUrl: string;
  /** Upload progress 0–100 */
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
  /** Filled after successful upload */
  storagePath?: string;
  publicUrl?: string;
  /** Alt text for accessibility & SEO */
  altText: string;
  /** Whether this is the primary/hero image */
  isPrimary: boolean;
}

interface SupabaseImageUploaderProps {
  /** Current images already saved */
  initialImages?: {
    publicUrl: string;
    storagePath?: string;
    altText?: string;
    isPrimary?: boolean;
  }[];
  /** Storage folder for new uploads */
  folder?: "products" | "categories" | "collections" | "banners" | "general";
  /** Entity ID (e.g. product ID) for organised paths */
  entityId?: string;
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Maximum file size in MB (default 10) */
  maxFileSizeMb?: number;
  /** Called whenever the image list changes */
  onChange?: (images: StorageImageEntry[]) => void;
  className?: string;
  label?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SupabaseImageUploader({
  initialImages = [],
  folder = "products",
  entityId,
  maxImages = 10,
  maxFileSizeMb = 10,
  onChange,
  className = "",
  label = "Product Images",
}: SupabaseImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const dropZoneId = useId();

  // Seed initial images
  const [images, setImages] = useState<StorageImageEntry[]>(() =>
    initialImages.map((img, idx) => ({
      localId: uid(),
      previewUrl: img.publicUrl,
      progress: 100,
      status: "done" as UploadStatus,
      storagePath: img.storagePath,
      publicUrl: img.publicUrl,
      altText: img.altText ?? "",
      isPrimary: img.isPrimary ?? idx === 0,
    }))
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // ── Notify parent on change ─────────────────────────────────────────────────
  const notify = useCallback(
    (updated: StorageImageEntry[]) => {
      setImages(updated);
      onChange?.(updated);
    },
    [onChange]
  );

  // ── Upload single file ──────────────────────────────────────────────────────
  const uploadFile = useCallback(
    async (file: File, localId: string) => {
      const maxBytes = maxFileSizeMb * 1024 * 1024;

      const patch = (partial: Partial<StorageImageEntry>) =>
        setImages((prev) =>
          prev.map((img) => (img.localId === localId ? { ...img, ...partial } : img))
        );

      try {
        patch({ status: "converting", progress: 5 });

        // Client-side WebP conversion
        let uploadReady = file;
        let uploadType: string = file.type;
        if (!file.type.includes("webp")) {
          const result = await convertFileToWebP(file);
          if (result.converted) {
            uploadReady = result.file;
            uploadType = "image/webp";
          }
        }

        if (uploadReady.size > maxBytes) {
          patch({
            status: "error",
            errorMessage: `File too large (${(uploadReady.size / 1024 / 1024).toFixed(1)} MB). Max ${maxFileSizeMb} MB.`,
          });
          return;
        }

        const contentType = uploadType || "image/webp";

        patch({ status: "uploading", progress: 15 });

        // 1. Request presigned URL from server
        const presignRes = await fetch("/api/storage/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType,
            folder,
            entityId,
            fileSizeHint: uploadReady.size,
          }),
        });

        const presignData = await presignRes.json();
        if (!presignRes.ok || !presignData.success) {
          throw new Error(presignData.error ?? "Failed to get upload URL.");
        }

        const { presignedUrl, storagePath, publicUrl } = presignData;

        patch({ progress: 25 });

        // 2. Upload directly to Supabase Storage via presigned URL
        // Supabase signed upload uses PUT with the token in the URL
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", contentType);
          xhr.setRequestHeader("x-upsert", "false");

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round(25 + (e.loaded / e.total) * 70);
              patch({ progress: pct });
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Storage upload failed: HTTP ${xhr.status} — ${xhr.responseText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload."));
          xhr.send(uploadReady);
        });

        // 3. Mark done
        setImages((prev) => {
          const updated = prev.map((img) =>
            img.localId === localId
              ? {
                  ...img,
                  status: "done" as UploadStatus,
                  progress: 100,
                  storagePath,
                  publicUrl,
                  previewUrl: publicUrl,
                }
              : img
          );
          onChange?.(updated);
          return updated;
        });
      } catch (err: unknown) {
        patch({
          status: "error",
          progress: 0,
          errorMessage: err instanceof Error ? err.message : "Upload failed.",
        });
      }
    },
    [folder, entityId, maxFileSizeMb, onChange]
  );

  // ── Add files ───────────────────────────────────────────────────────────────
  const addFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxImages - images.length;
      if (remaining <= 0) return;

      const toProcess = files
        .filter(
          (f) =>
            f.type.startsWith("image/") &&
            !f.type.includes("gif") &&
            !f.type.includes("svg")
        )
        .slice(0, remaining);

      if (toProcess.length === 0) return;

      const newEntries: StorageImageEntry[] = toProcess.map((file, idx) => ({
        localId: uid(),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: "idle" as UploadStatus,
        altText: "",
        isPrimary: images.length === 0 && idx === 0,
      }));

      setImages((prev) => [...prev, ...newEntries]);

      for (const entry of newEntries) {
        await uploadFile(entry.file!, entry.localId);
      }
    },
    [images.length, maxImages, uploadFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) addFiles(files);
    e.target.value = "";
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  // ── Reorder ─────────────────────────────────────────────────────────────────
  const handleDragStart = (idx: number) => { dragItem.current = idx; };
  const handleDragEnterItem = (idx: number) => { dragOverItem.current = idx; };
  const handleDropItem = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;
    const updated = [...images];
    const [moved] = updated.splice(dragItem.current, 1);
    updated.splice(dragOverItem.current, 0, moved);
    dragItem.current = null;
    dragOverItem.current = null;
    notify(updated);
  };

  // ── Remove ──────────────────────────────────────────────────────────────────
  const removeImage = async (localId: string) => {
    const img = images.find((i) => i.localId === localId);
    if (img?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(img.previewUrl);

    // Delete from Supabase Storage if already uploaded
    if (img?.storagePath) {
      try {
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storagePath: img.storagePath }),
        });
      } catch {
        // Non-critical — image is visually removed regardless
      }
    }

    const updated = images.filter((i) => i.localId !== localId);
    if (updated.length > 0 && !updated.some((i) => i.isPrimary)) {
      updated[0].isPrimary = true;
    }
    notify(updated);
  };

  // ── Retry ───────────────────────────────────────────────────────────────────
  const retryUpload = (localId: string) => {
    const img = images.find((i) => i.localId === localId);
    if (img?.file) {
      setImages((prev) =>
        prev.map((i) =>
          i.localId === localId
            ? { ...i, status: "idle", errorMessage: undefined, progress: 0 }
            : i
        )
      );
      uploadFile(img.file, localId);
    }
  };

  const setPrimary = (localId: string) => {
    notify(images.map((img) => ({ ...img, isPrimary: img.localId === localId })));
  };

  const updateAlt = (localId: string, altText: string) => {
    notify(images.map((img) => (img.localId === localId ? { ...img, altText } : img)));
  };

  const canAddMore = images.length < maxImages;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-serif uppercase tracking-wider text-stone-300">
          {label}
        </label>
        <span className="text-[10px] font-mono text-stone-500">
          {images.length}/{maxImages} · Auto-converts to WebP
        </span>
      </div>

      {/* Drop Zone */}
      {canAddMore && (
        <div
          id={dropZoneId}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDropZoneDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all
            ${isDragOver
              ? "border-[#e5a110] bg-[#e5a110]/10 scale-[1.01]"
              : "border-stone-700 hover:border-[#e5a110]/60 bg-black/30 hover:bg-[#e5a110]/5"
            }`}
        >
          <Upload className="w-6 h-6 text-[#f5b92e]" />
          <div className="text-center">
            <p className="text-xs font-serif text-stone-300">
              Drag &amp; drop images here, or{" "}
              <span className="text-[#f5b92e] underline underline-offset-2">browse</span>
            </p>
            <p className="text-[10px] text-stone-500 mt-0.5 font-sans">
              JPG, PNG, WebP, AVIF · Max {maxFileSizeMb} MB each · Stored in Supabase
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.localId}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnterItem(idx)}
              onDragEnd={handleDropItem}
              onDragOver={(e) => e.preventDefault()}
              className="relative group rounded-xl overflow-hidden border border-stone-700 bg-stone-900 aspect-[3/4] select-none"
            >
              {/* Preview */}
              {img.previewUrl ? (
                <Image
                  src={img.previewUrl}
                  alt={img.altText || `Product image ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={img.previewUrl.startsWith("blob:")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-8 h-8 text-stone-600" />
                </div>
              )}

              {/* Upload overlay */}
              {(img.status === "converting" || img.status === "uploading") && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#f5b92e] animate-spin" />
                  <div className="w-3/4 h-1 bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#e5a110] rounded-full transition-all duration-300"
                      style={{ width: `${img.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-stone-300">
                    {img.status === "converting" ? "Converting…" : `${img.progress}%`}
                  </span>
                </div>
              )}

              {/* Error overlay */}
              {img.status === "error" && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 p-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-[10px] text-red-300 text-center leading-tight">
                    {img.errorMessage ?? "Upload failed"}
                  </p>
                  <button
                    type="button"
                    onClick={() => retryUpload(img.localId)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-700 hover:bg-stone-600 text-[10px] text-stone-200 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Retry
                  </button>
                </div>
              )}

              {/* Done badge */}
              {img.status === "done" && (
                <div className="absolute top-1.5 left-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow" />
                </div>
              )}

              {/* Primary badge */}
              {img.isPrimary && (
                <div className="absolute top-1.5 right-7 bg-[#e5a110] rounded px-1.5 py-0.5 text-[8px] font-serif uppercase tracking-wider text-[#04160d] font-bold">
                  Primary
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-stone-400 cursor-grab" />
              </div>

              {/* Action bar (shown on hover) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <input
                  type="text"
                  value={img.altText}
                  onChange={(e) => updateAlt(img.localId, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Alt text…"
                  className="w-full px-2 py-1 mb-1.5 bg-black/70 border border-stone-600 rounded text-[10px] text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]"
                />
                <div className="flex gap-1.5">
                  {!img.isPrimary && img.status === "done" && (
                    <button
                      type="button"
                      onClick={() => setPrimary(img.localId)}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#e5a110]/20 hover:bg-[#e5a110]/40 text-[#f5b92e] text-[9px] font-serif transition-colors"
                    >
                      <Star className="w-2.5 h-2.5" /> Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.localId)}
                    className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-red-900/30 hover:bg-red-700/50 text-red-300 text-[9px] font-serif transition-colors"
                  >
                    <X className="w-2.5 h-2.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {images.filter((i) => i.status === "done" && i.publicUrl).length > 0 && (
        <p className="text-[10px] text-emerald-400 font-mono">
          {images.filter((i) => i.status === "done").length} image(s) ready · Supabase Storage
        </p>
      )}
    </div>
  );
}
