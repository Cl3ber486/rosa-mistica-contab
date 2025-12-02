"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Wallet, FileText, Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Membros", href: "/members" },
    { icon: Wallet, label: "Financeiro", href: "/finance" },
    { icon: FileText, label: "Relatórios", href: "/reports" },
    { icon: Settings, label: "Configurações", href: "/settings" },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out",
                    isOpen ? "w-64" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20",
                    "lg:block"
                )}
            >
                <div className="flex items-center justify-center h-16 border-b border-slate-800">
                    <h1 className={cn("font-bold text-xl", !isOpen && "lg:hidden")}>RMContab</h1>
                    <h1 className={cn("font-bold text-xl hidden", !isOpen && "lg:block")}>RM</h1>
                </div>

                <nav className="mt-6 px-2 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                <span className={cn("ml-3 font-medium", !isOpen && "lg:hidden")}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}
