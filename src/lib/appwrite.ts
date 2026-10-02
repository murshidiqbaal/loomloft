import { Client } from "appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("6abf932900194629e8a4");

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
