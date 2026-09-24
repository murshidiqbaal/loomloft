import StyleFinderQuiz from "@/components/interactive/StyleFinderQuiz";

export const metadata = {
  title: "Style Finder & Fashion Consultation | LOOM LOFT",
  description: "Find your ideal handloom silhouette and weaver guild through our interactive fashion consultation quiz."
};

export default function StyleFinderPage() {
  return (
    <div className="min-h-screen bg-[#072618]">
      <StyleFinderQuiz />
    </div>
  );
}
