import ItemDetailPage from "@/components/common/ItemDetailPage";
import { ReturnButton } from "@/components/common/ReturnButton";

export default function mobileProductDetailPage() {
  // Adjust this value to match the actual height of your nav + ReturnButton
  const HEADER_HEIGHT = 80; // px

  return (
    <div className="bg-[#f3f6f8]">
      <div className="py-6 px-4">
        <ReturnButton href="/mobile/items" />
      </div>
      <ItemDetailPage />
    </div>
  );
}
