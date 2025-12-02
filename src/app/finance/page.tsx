"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface Transaction {
    id: string
    type: 'income' | 'expense'
    category: string
    amount: number
    description: string
    date: string
    member_id?: string
    members?: { full_name: string }
}

interface Member {
    id: string
    full_name: string
}

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        type: 'income',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        member_id: ''
    })

    useEffect(() => {
        fetchTransactions()
        fetchMembers()
    }, [])

    async function fetchMembers() {
        const { data } = await supabase.from('members').select('id, full_name').order('full_name')
        if (data) setMembers(data)
    }

    async function fetchTransactions() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('transactions')
                .select('*, members(full_name)')
                .order('date', { ascending: false })

            if (error) throw error
            if (data) setTransactions(data)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('transactions')
                .insert([{
                    ...formData,
                    member_id: formData.member_id || null
                }])

            if (error) throw error

            setShowForm(false)
            setFormData({
                type: 'income',
                category: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                member_id: ''
            })
            fetchTransactions()
        } catch (error) {
            alert('Erro ao salvar transação: ' + JSON.stringify(error))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Financeiro</h2>
                    <p className="text-slate-500">Gerencie entradas e saídas</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Nova Transação
                </button>
            </div>

            {/* Filters/Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar transações..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Data</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Descrição</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Categoria</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Valor</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Nenhuma transação encontrada.</td></tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(t.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{t.description || '-'}</div>
                                        {t.members && <div className="text-xs text-slate-500">{t.members.full_name}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <div className={cn("flex items-center gap-1", t.type === 'income' ? "text-green-600" : "text-red-600")}>
                                            {t.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                                            R$ {Number(t.amount).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-red-600 hover:text-red-800 p-1"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Transaction Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Nova Transação</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                    className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                        formData.type === 'income' ? "bg-white shadow text-green-700" : "text-slate-500 hover:text-slate-700")}
                                >
                                    Entrada
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                    className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                        formData.type === 'expense' ? "bg-white shadow text-red-700" : "text-slate-500 hover:text-slate-700")}
                                >
                                    Saída
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Valor (R$)</label>
                                <input required type="number" step="0.01" className="w-full p-2 border rounded-lg text-lg font-bold"
                                    value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Categoria</label>
                                <select required className="w-full p-2 border rounded-lg"
                                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {formData.type === 'income' ? (
                                        <>
                                            <option value="Dízimo">Dízimo</option>
                                            <option value="Oferta">Oferta</option>
                                            <option value="Doação">Doação</option>
                                            <option value="Cantina">Cantina</option>
                                            <option value="Outros">Outros</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Água">Água</option>
                                            <option value="Luz">Luz</option>
                                            <option value="Aluguel">Aluguel</option>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Salários">Salários</option>
                                            <option value="Eventos">Eventos</option>
                                            <option value="Outros">Outros</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Data</label>
                                <input required type="date" className="w-full p-2 border rounded-lg"
                                    value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Descrição (Opcional)</label>
                                <input type="text" className="w-full p-2 border rounded-lg"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            {formData.type === 'income' && formData.category === 'Dízimo' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Membro (Opcional)</label>
                                    <select className="w-full p-2 border rounded-lg"
                                        value={formData.member_id} onChange={e => setFormData({ ...formData, member_id: e.target.value })}
                                    >
                                        <option value="">Selecione um membro...</option>
                                        {members.map(m => (
                                            <option key={m.id} value={m.id}>{m.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
