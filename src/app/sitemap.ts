import { MetadataRoute } from "next";
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS } from "@/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://loomloft.net";

  const staticRoutes = [
    "",
    "/collections",
    "/products",
    "/about",
    "/contact",
    "/wishlist",
    "/cart",
    "/checkout",
    "/style-finder",
    "/community"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  const productRoutes = INITIAL_PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9
  }));

  const collectionRoutes = INITIAL_COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
