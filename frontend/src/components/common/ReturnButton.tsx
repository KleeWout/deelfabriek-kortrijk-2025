"use client";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { usePathname } from "next/navigation";

interface ReturnButtonProps {
  href?: string; // Make this optional so we can use the automatic detection
}

export function ReturnButton({ href }: ReturnButtonProps) {
  const pathname = usePathname();

  // If href is provided, use it; otherwise determine from the current path
  const returnPath = href || getReturnPathFromCurrentPath(pathname);

  return (
    <Link href={returnPath} className="bg-secondarygreen-1 py-2.5 px-8 flex justify-center items-center rounded-lg w-fit">
      <ArrowLeft size={26} color="#004431" />
    </Link>
  );
}

// Helper function to determine the appropriate return path
function getReturnPathFromCurrentPath(pathname: string): string {
  // Check if the path contains 'tablet' or 'mobile'
  if (pathname.includes("/kiosk/")) {
    return "/kiosk/items";
  } else {
    return "/items";
  }

  // Default fallback
  return "/";
}
