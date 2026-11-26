/**
 * Client-side image converter utility.
 * Converts selected image files (JPG, PNG, GIF, BMP, etc.) into WebP in the browser
 * before network upload, reducing bandwidth and providing instant WebP files.
 */

export async function convertFileToWebP(
  file: File,
  quality = 0.85
): Promise<{ file: File; converted: boolean; originalName: string }> {
  const originalName = file.name;

  // Check if file is an image
  const isImage =
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|bmp|gif|tiff|webp|avif)$/i.test(file.name);

  if (!isImage) {
    return { file, converted: false, originalName };
  }

  // If already WebP, return as is
  if (file.type === "image/webp" && file.name.endsWith(".webp")) {
    return { file, converted: true, originalName };
  }

  // Browser check
  if (typeof window === "undefined") {
    return { file, converted: false, originalName };
  }

  try {
    // Attempt using createImageBitmap or Image element
    let imageWidth = 0;
    let imageHeight = 0;
    let sourceDrawable: ImageBitmap | HTMLImageElement;

    if (typeof window !== "undefined" && typeof window.createImageBitmap === "function") {
      sourceDrawable = await createImageBitmap(file);
      imageWidth = sourceDrawable.width;
      imageHeight = sourceDrawable.height;
    } else {
      sourceDrawable = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      imageWidth = sourceDrawable.width;
      imageHeight = sourceDrawable.height;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { file, converted: false, originalName };
    }

    ctx.drawImage(sourceDrawable, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/webp", quality);
    });

    if (sourceDrawable instanceof ImageBitmap) {
      sourceDrawable.close();
    }

    if (!blob) {
      return { file, converted: false, originalName };
    }

    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const webpFileName = `${baseName}.webp`;

    const webpFile = new File([blob], webpFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    return {
      file: webpFile,
      converted: true,
      originalName,
    };
  } catch (error) {
    console.warn("Client WebP conversion fallback to server conversion:", error);
    return { file, converted: false, originalName };
  }
}
