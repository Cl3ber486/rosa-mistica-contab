import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
    className?: string
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
    return (
        <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-slate-100", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="text-blue-600" size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={cn("font-medium", trendUp ? "text-green-600" : "text-red-600")}>
                        {trend}
                    </span>
                    <span className="text-slate-400 ml-2">vs mês anterior</span>
                </div>
            )}
        </div>
    )
}
