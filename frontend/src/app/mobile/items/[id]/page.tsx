import ItemDetailPage from "@/components/common/ItemDetailPage";
import { ReturnButton } from "@/components/common/ReturnButton";


export default function mobileProductDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f8]">
      <div className="py-7 px-4">
        <ReturnButton href="/mobile/items" />
      </div>
      <ItemDetailPage />
    </div>
  );
}