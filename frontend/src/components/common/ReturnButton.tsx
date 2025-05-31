import Link from "next/link";

import { ArrowLeft } from "phosphor-react";

interface ReturnButtonProps {
  href: string;
}

export function ReturnButton({ href }: ReturnButtonProps) {
  return (
    <Link href="/mobile/items" className="bg-secondarygreen-1 py-2.5 px-8 flex justify-center items-center rounded-lg w-fit">
      <ArrowLeft size={26} color="#004431" />
    </Link>
  );
}
