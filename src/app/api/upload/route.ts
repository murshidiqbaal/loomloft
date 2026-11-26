import { NextRequest, NextResponse } from "next/server";
import { uploadMediaFile } from "@/lib/appwrite-server";
import { isImageFile } from "@/lib/image-processing";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      // Check if "document" or "image" field was sent instead
      const fallbackFile = (formData.get("document") || formData.get("image")) as File | null;
      if (fallbackFile && fallbackFile.size > 0) {
        files.push(fallbackFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No file was provided in the upload request." },
        { status: 400 }
      );
    }

    const uploadedResults = [];
    for (const file of files) {
      if (!file || file.size === 0) continue;

      const result = await uploadMediaFile(file);
      uploadedResults.push({
        url: result.url,
        name: result.name,
        type: result.type,
        size: result.size,
        fileId: result.file_id,
        isImage: isImageFile(result.name, result.type),
        convertedToWebp: result.converted_to_webp,
      });
    }

    if (uploadedResults.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid files could be processed." },
        { status: 400 }
      );
    }

    // Return single object if single file, or array if multiple
    if (uploadedResults.length === 1) {
      return NextResponse.json({
        success: true,
        file: uploadedResults[0],
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedResults,
      count: uploadedResults.length,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process and upload file(s).",
      },
      { status: 500 }
    );
  }
}
