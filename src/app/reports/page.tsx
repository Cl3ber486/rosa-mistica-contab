"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ChartData {
    name: string
    value: number
}

export default function ReportsPage() {
    const [incomeData, setIncomeData] = useState<ChartData[]>([])
    const [expenseData, setExpenseData] = useState<ChartData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('transactions')
                .select('type, category, amount')

            if (error) throw error

            if (data) {
                // Process Income
                const incomeMap = new Map()
                data.filter(t => t.type === 'income').forEach(t => {
                    const current = incomeMap.get(t.category) || 0
                    incomeMap.set(t.category, current + Number(t.amount))
                })
                setIncomeData(Array.from(incomeMap).map(([name, value]) => ({ name, value: value as number })))

                // Process Expense
                const expenseMap = new Map()
                data.filter(t => t.type === 'expense').forEach(t => {
                    const current = expenseMap.get(t.category) || 0
                    expenseMap.set(t.category, current + Number(t.amount))
                })
                setExpenseData(Array.from(expenseMap).map(([name, value]) => ({ name, value: value as number })))
            }
        } catch (error) {
            console.error('Error fetching report data:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Relatórios</h2>
                <p className="text-slate-500">Análise financeira por categoria</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Income Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Entradas por Categoria</h3>
                    <div className="h-80">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-slate-400">Carregando...</div>
                        ) : incomeData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400">Sem dados</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={incomeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {incomeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Expense Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Saídas por Categoria</h3>
                    <div className="h-80">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-slate-400">Carregando...</div>
                        ) : expenseData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400">Sem dados</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
