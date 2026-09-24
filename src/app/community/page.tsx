import CommunityUGC from "@/components/social/CommunityUGC";

export const metadata = {
  title: "LoomLoft Community & Patron Archive | LOOM LOFT",
  description: "Browse photos, reviews, and editorial moments from patrons of LoomLoft handloom creations across the world."
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#072618]">
      <CommunityUGC />
    </div>
  );
}
