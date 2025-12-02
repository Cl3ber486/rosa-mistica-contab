"use client"

import { Users, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Fev', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Abr', income: 2780, expense: 3908 },
  { name: 'Mai', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Visão geral da Igreja Rosa Mística</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Membros"
          value="1,234"
          icon={Users}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Entradas (Mês)"
          value="R$ 12.450"
          icon={TrendingUp}
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="Saídas (Mês)"
          value="R$ 4.200"
          icon={TrendingDown}
          trend="-2.4%"
          trendUp={true}
        />
        <StatCard
          title="Saldo Atual"
          value="R$ 45.200"
          icon={DollarSign}
          className="border-blue-100 bg-blue-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Fluxo de Caixa</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="income" name="Entradas" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Últimas Transações</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                    DZ
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">Dízimo - João Silva</p>
                    <p className="text-xs text-slate-500">Hoje, 14:30</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">+ R$ 150,00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
