import { Client } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6abf932900194629e8a4";

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export { client };

// Ping Appwrite once when the app starts
if (typeof window !== "undefined") {
  client.ping()
    .then((response) => {
      console.log("Appwrite initialized successfully:", response);
    })
    .catch((error) => {
      console.log("Appwrite ping response:", error);
    });
} else {
  client.ping().catch(() => {});
}
