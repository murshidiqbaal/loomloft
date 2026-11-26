import sharp, { type OutputInfo } from "sharp";
import { getServerAppwrite } from "./appwrite-server";
import { Permission, Role } from "node-appwrite";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "avif",
  "svg",
  "heic",
  "heif",
]);

/**
 * Determines whether a given filename or MIME type represents an image.
 */
export function isImageFile(fileName: string, mimeType?: string): boolean {
  if (mimeType && mimeType.toLowerCase().startsWith("image/")) {
    return true;
  }
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTENSIONS.has(ext);
}

/**
 * Converts any image buffer to optimized WebP format using Sharp.
 */
export async function convertBufferToWebP(
  input: Buffer | Uint8Array | ArrayBuffer,
  options: { quality?: number; effort?: number } = {}
): Promise<{ buffer: Buffer; info: OutputInfo }> {
  const quality = options.quality ?? 85;
  const effort = options.effort ?? 4;

  const nodeBuffer = Buffer.isBuffer(input)
    ? input
    : input instanceof ArrayBuffer
    ? Buffer.from(input)
    : Buffer.from(input.buffer, input.byteOffset, input.byteLength);

  const pipeline = sharp(nodeBuffer).webp({
    quality,
    effort,
  });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return { buffer: data, info };
}

/**
 * Ensures an Appwrite storage bucket exists. If not found, creates it automatically.
 */
export async function ensureAppwriteBucket(
  bucketId: string,
  bucketName = "Storage Bucket"
): Promise<void> {
  const { storage } = getServerAppwrite();
  try {
    await storage.getBucket(bucketId);
  } catch (error: any) {
    // If bucket does not exist (404), create it
    if (error?.code === 404 || error?.status === 404 || error?.message?.includes("not found")) {
      console.log(`[Storage] Bucket '${bucketId}' not found. Creating bucket now...`);
      try {
        await storage.createBucket(
          bucketId,
          bucketName,
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
          ],
          false, // fileSecurity
          true,  // enabled
          25 * 1024 * 1024, // 25MB max size
          ["jpg", "jpeg", "png", "webp", "gif", "avif", "pdf"]
        );
        console.log(`[Storage] Bucket '${bucketId}' created successfully.`);
      } catch (createErr: any) {
        console.warn(`[Storage] Note when creating bucket:`, createErr.message);
      }
    }
  }
}

/**
 * Inspects an incoming upload File. If it is an image, converts it into a .webp File.
 * Preserves PDFs and non-images untouched.
 */
export async function prepareFileForUpload(file: File): Promise<{
  file: File;
  isWebpConverted: boolean;
  originalName: string;
  originalType: string;
  originalSize: number;
  finalSize: number;
}> {
  const originalName = file.name;
  const originalType = file.type || "application/octet-stream";
  const originalSize = file.size;

  if (!isImageFile(originalName, originalType)) {
    return {
      file,
      isWebpConverted: false,
      originalName,
      originalType,
      originalSize,
      finalSize: originalSize,
    };
  }

  // Convert image to WebP
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { buffer: webpBuffer } = await convertBufferToWebP(arrayBuffer, {
      quality: 85,
    });

    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const webpFileName = `${baseName}.webp`;

    const webpFile = new File([new Uint8Array(webpBuffer)], webpFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    return {
      file: webpFile,
      isWebpConverted: true,
      originalName,
      originalType,
      originalSize,
      finalSize: webpBuffer.length,
    };
  } catch (convErr: any) {
    console.error(`Failed to convert image '${originalName}' to WebP:`, convErr);
    // If conversion fails for any unforeseen reason, fallback to original file
    return {
      file,
      isWebpConverted: false,
      originalName,
      originalType,
      originalSize,
      finalSize: originalSize,
    };
  }
}
