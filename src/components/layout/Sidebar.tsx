"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "首页", path: "/" },
    { name: "行情", path: "/market" },
    { name: "个股详情", path: "/stocks" },
    { name: "行业与概念", path: "/sectors" },
    { name: "投资组合", path: "/portfolio" },
    { name: "策略回测", path: "/backtest" },
    { name: "数据分析", path: "/analysis" },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">量化交易平台</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-4 py-2 rounded-md ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
        v1.0.0
      </div>
    </div>
  );
} 