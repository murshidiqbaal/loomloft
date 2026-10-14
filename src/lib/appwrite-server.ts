import { Client, Databases, Storage, ID, Query } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6abf932900194629e8a4";
const apiKey = process.env.APPWRITE_API_KEY || "";
const databaseId = process.env.APPWRITE_DATABASE_ID || "6abf951c0003f3745848";
export const TRACKING_BUCKET_ID = "tracking-documents";

let serverClient: Client | null = null;
let serverDatabases: Databases | null = null;
let serverStorage: Storage | null = null;

export function getServerAppwrite() {
  if (!apiKey) {
    console.warn("APPWRITE_API_KEY is not defined in environment.");
  }
  if (!serverClient) {
    serverClient = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId);

    if (apiKey) {
      serverClient.setKey(apiKey);
    }

    serverDatabases = new Databases(serverClient);
    serverStorage = new Storage(serverClient);
  }

  return {
    client: serverClient,
    databases: serverDatabases!,
    storage: serverStorage!,
    databaseId,
    endpoint,
    projectId,
  };
}

export interface UploadedTrackingDocument {
  document_url: string;
  document_name: string;
  document_type: string;
  document_file_id: string;
}

/**
 * Uploads an optional courier document (PDF, JPG, PNG up to 10MB) to Appwrite Storage.
 * Never stores raw binary in TablesDB.
 */
export async function uploadTrackingDocument(
  file: File
): Promise<UploadedTrackingDocument | null> {
  try {
    if (!file || file.size === 0) return null;

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("File exceeds maximum allowed size of 10MB");
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowed = ["pdf", "jpg", "jpeg", "png"];
    if (!allowed.includes(ext)) {
      throw new Error(`Invalid file type .${ext}. Allowed formats: PDF, JPG, PNG.`);
    }

    const { endpoint, projectId } = getServerAppwrite();
    const currentApiKey = process.env.APPWRITE_API_KEY || apiKey;
    const fileId = ID.unique();

    // Use native multipart upload to Appwrite Storage
    const formData = new FormData();
    formData.append("fileId", fileId);
    formData.append("file", file);
    formData.append("permissions[]", 'read("any")');

    const uploadRes = await fetch(`${endpoint}/storage/buckets/${TRACKING_BUCKET_ID}/files`, {
      method: "POST",
      headers: {
        "X-Appwrite-Project": projectId,
        "X-Appwrite-Key": currentApiKey,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Appwrite storage upload error:", errText);
      throw new Error(`Failed to upload document to Appwrite Storage: ${uploadRes.statusText}`);
    }

    const uploaded = await uploadRes.json();
    const finalFileId = uploaded.$id || fileId;

    // Generate secure view URL
    const documentUrl = `${endpoint}/storage/buckets/${TRACKING_BUCKET_ID}/files/${finalFileId}/view?project=${projectId}`;

    return {
      document_url: documentUrl,
      document_name: file.name,
      document_type: file.type || (ext === "pdf" ? "application/pdf" : `image/${ext}`),
      document_file_id: finalFileId,
    };
  } catch (error: any) {
    console.error("Failed to upload courier document:", error);
    throw error;
  }
}
