"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Member {
    id: string
    full_name: string
    phone: string
    is_tither: boolean
    tither_code: string
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        birth_date: "",
        cpf: "",
        rg: "",
        address: "",
        phone: "",
        email: "",
        is_tither: false,
        tither_code: ""
    })

    useEffect(() => {
        fetchMembers()
    }, [])

    async function fetchMembers() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('full_name')

            if (error) throw error
            if (data) setMembers(data)
        } catch (error) {
            console.error('Error fetching members:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('members')
                .insert([formData])

            if (error) throw error

            setShowForm(false)
            setFormData({
                full_name: "",
                birth_date: "",
                cpf: "",
                rg: "",
                address: "",
                phone: "",
                email: "",
                is_tither: false,
                tither_code: ""
            })
            fetchMembers()
        } catch (error) {
            alert('Erro ao salvar membro: ' + JSON.stringify(error))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Membros</h2>
                    <p className="text-slate-500">Gerencie os membros da igreja</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Novo Membro
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, CPF ou telefone..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Members List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Nome</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Telefone</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Dizimista</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                        ) : members.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum membro cadastrado.</td></tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{member.full_name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{member.phone || '-'}</td>
                                    <td className="px-6 py-4">
                                        {member.is_tither ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Sim ({member.tither_code})
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                Não
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800 p-1"><Edit size={18} /></button>
                                        <button className="text-red-600 hover:text-red-800 p-1"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Member Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Novo Membro</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg"
                                        value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
                                    <input type="date" className="w-full p-2 border rounded-lg"
                                        value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">CPF</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg"
                                        value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">RG</label>
                                    <input type="text" className="w-full p-2 border rounded-lg"
                                        value={formData.rg} onChange={e => setFormData({ ...formData, rg: e.target.value })} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Endereço</label>
                                    <input type="text" className="w-full p-2 border rounded-lg"
                                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Telefone</label>
                                    <input type="text" className="w-full p-2 border rounded-lg"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">E-mail</label>
                                    <input type="email" className="w-full p-2 border rounded-lg"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <input type="checkbox" id="is_tither" className="w-4 h-4"
                                        checked={formData.is_tither} onChange={e => setFormData({ ...formData, is_tither: e.target.checked })} />
                                    <label htmlFor="is_tither" className="text-sm font-medium text-slate-700">É Dizimista?</label>
                                </div>

                                {formData.is_tither && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Código do Dizimista (4 dígitos)</label>
                                        <input type="text" maxLength={4} className="w-full md:w-1/3 p-2 border rounded-lg"
                                            value={formData.tither_code} onChange={e => setFormData({ ...formData, tither_code: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Membro</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
