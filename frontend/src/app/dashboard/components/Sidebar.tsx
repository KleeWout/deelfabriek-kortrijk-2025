"use client";

import { getIconByName } from "@/utils/iconUtils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "SquaresFour" },
  { name: "Producten", href: "/dashboard/producten", icon: "Package" },
  { name: "Reservaties", href: "/dashboard/reservaties", icon: "CalendarDots" },
  { name: "Lockers", href: "/dashboard/lockers", icon: "Lockers" },
  { name: "Rapporten", href: "/dashboard/rapporten", icon: "FileText" },
  { name: "Openingsuren", href: "/dashboard/openingsuren", icon: "Calendar" },
  { name: "Instellingen", href: "/dashboard/instellingen", icon: "Gear" },
];

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
}

function getSidebarItem(
  { name, href, icon }: SidebarItem,
  collapsed: boolean,
  currentPath: string
) {
  const IconComponent = getIconByName(icon);

  return (
    <Link
      href={href}
      className={`flex items-center h-12 px-4 py-3 text-base rounded-md ${
        currentPath === href
          ? "bg-green-950 text-white"
          : "text-gray-300 hover:bg-green-800"
      }`}
    >
      <div
        className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
        style={{ width: "100%" }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconComponent size={32} weight="regular" color="#ffffff" />
        </div>
        {!collapsed && name}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const CaretIcon = getIconByName(collapsed ? "CaretRight" : "CaretLeft");

  return (
    <div
      className={`bg-primarygreen-1 text-white ${collapsed ? "w-16" : "w-64"} flex flex-col h-screen transition-width duration-300`}
    >
      <div className="p-4 border-b border-white flex items-center justify-between">
        {!collapsed && <span className="font-bold text-xl">Dashboard</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-green-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CaretIcon size={24} weight="regular" color="#ffffff" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto pt-5 pb-4">
        <ul className={`space-y-1 ${collapsed ? "px-1" : "px-2"}`}>
          {navigation.map((item) => (
            <li key={item.href}>
              {getSidebarItem(
                { name: item.name, href: item.href, icon: item.icon },
                collapsed,
                pathname
              )}
            </li>
          ))}
        </ul>
      </nav>
      {/* pfp */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700 flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
              U
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Username</p>
            <p className="text-xs font-medium text-gray-400">Admin</p>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="p-2 border-t border-gray-700 flex justify-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
              U
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
