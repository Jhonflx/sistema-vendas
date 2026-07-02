'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Mail, Building2, Save, Search, AlertCircle, Edit2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Fornecedor {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual?: string
  email: string
  telefone: string
  endereco: string
  nomeVendedor: string
  categorias: string[]
  observacoes?: string
  status: 'Ativo' | 'Inativo'
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: '1',
      razaoSocial: 'Alpha Vestuário LTDA',
      nomeFantasia: 'Distribuidora Alpha',
      cnpj: '11.222.333/0001-44',
      inscricaoEstadual: '123.456.789.110',
      email: 'comercial@alpha.com',
      telefone: '(11) 98888-7777',
      endereco: 'Av. das Indústrias, 500 - São Paulo/SP',
      nomeVendedor: 'Roberto Souza',
      categorias: ['Vestuário'],
      observacoes: 'Entregas apenas às terças-feiras.',
      status: 'Ativo'
    },
    {
      id: '2',
      razaoSocial: 'Hortifruti & Alimentos Brasil S.A.',
      nomeFantasia: 'Brasil Alimentos',
      cnpj: '22.333.444/0001-55',
      inscricaoEstadual: '987.654.321.000',
      email: 'pedidos@brasilalimentos.com.br',
      telefone: '(21) 97777-1122',
      endereco: 'Rua do Mercado Central, 12 - Rio de Janeiro/RJ',
      nomeVendedor: 'Mariana Costa',
      categorias: ['Alimentos', 'Bebidas'],
      observacoes: 'Prazo de faturamento padrão: 28 dias.',
      status: 'Ativo'
    },
    {
      id: '3',
      razaoSocial: 'Indústria Química Limpa Tudo LTDA',
      nomeFantasia: 'Limpa Tudo Atacado',
      cnpj: '33.444.555/0001-66',
      inscricaoEstadual: '456.123.789.555',
      email: 'vendas@limpatudo.com',
      telefone: '(31) 96666-4433',
      endereco: 'Distrito Industrial, Galpão B - Belo Horizonte/MG',
      nomeVendedor: 'Carlos Eduardo',
      categorias: ['Limpeza'],
      observacoes: 'Pedido mínimo de R$ 500,00 para frete grátis.',
      status: 'Ativo'
    },
    {
      id: '4',
      razaoSocial: 'Tech & Conectividade Importações',
      nomeFantasia: 'Global Tech',
      cnpj: '44.555.666/0001-77',
      inscricaoEstadual: '789.456.123.888',
      email: 'suporte@globaltech.com',
      telefone: '(11) 95555-8899',
      endereco: 'Alameda Lorena, 1500 - São Paulo/SP',
      nomeVendedor: 'Aline Vieira',
      categorias: ['Eletrônicos'],
      observacoes: 'Fornecedor temporariamente inativo por reestruturação de estoque.',
      status: 'Inativo'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    email: '',
    telefone: '',
    endereco: '',
    nomeVendedor: '',
    observacoes: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
    categorias: [] as string[]
  })

  useEffect(() => {
    const savedSuppliers = localStorage.getItem('sgpv-suppliers-v2')
    if (savedSuppliers) setFornecedores(JSON.parse(savedSuppliers))
  }, [])

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 14) value = value.slice(0, 14)
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    setFormData(prev => ({ ...prev, cnpj: value }))
  }

  const toggleCategoria = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter(c => c !== cat)
        : [...prev.categorias, cat]
    }))
  }

  const handleOpenEdit = (forn: Fornecedor) => {
    setEditingId(forn.id)
    setFormData({
      razaoSocial: forn.razaoSocial,
      nomeFantasia: forn.nomeFantasia,
      cnpj: forn.cnpj,
      inscricaoEstadual: forn.inscricaoEstadual || '',
      email: forn.email,
      telefone: forn.telefone,
      endereco: forn.endereco,
      nomeVendedor: forn.nomeVendedor,
      observacoes: forn.observacoes || '',
      status: forn.status,
      categorias: forn.categorias
    })
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.razaoSocial || !formData.nomeFantasia || !formData.cnpj || !formData.email || !formData.telefone) {
      toast.error('Por favor, preencha todos os campos obrigatórios destacados.')
      return
    }

    const cnpjExiste = fornecedores.some(f => f.cnpj === formData.cnpj && f.id !== editingId)
    if (cnpjExiste) {
      toast.error('Este fornecedor já consta no sistema com este CNPJ!')
      return
    }

    let updatedList: Fornecedor[]

    if (editingId) {
      updatedList = fornecedores.map(f => f.id === editingId ? { ...f, ...formData } : f)
      toast.success('Cadastro de fornecedor atualizado com sucesso!')
    } else {
      const novo: Fornecedor = {
        id: Date.now().toString(),
        ...formData
      }
      updatedList = [novo, ...fornecedores]
      toast.success('Fornecedor cadastrado com sucesso!')
    }

    setFornecedores(updatedList)
    localStorage.setItem('sgpv-suppliers-v2', JSON.stringify(updatedList))
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      email: '',
      telefone: '',
      endereco: '',
      nomeVendedor: '',
      observacoes: '',
      status: 'Ativo',
      categorias: []
    })
  }

  const filtered = fornecedores.filter(f =>
    f.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) || f.cnpj.includes(searchTerm)
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestão de Fornecedores</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Controle avançado de contratos, CNPJs, canais de atendimento e categorias de insumos.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <Plus className="h-4 w-4" /> Novo Cadastro
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Nome Fantasia ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-blue-600"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center p-12 space-y-2">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-500">Nenhum fornecedor localizado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-4">Empresa / Contato</th>
                  <th className="p-4">CNPJ / I.E</th>
                  <th className="p-4">Categorias</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="p-4 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {f.nomeFantasia} <span className="text-[10px] font-normal text-slate-400">({f.razaoSocial})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Vendedor: {f.nomeVendedor} | {f.telefone}</div>
                    </td>
                    <td className="p-4 font-mono text-[11px] space-y-0.5">
                      <div>{f.cnpj}</div>
                      <div className="text-slate-400 text-[10px]">I.E: {f.inscricaoEstadual || 'Isento'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {f.categorias.map(c => (
                          <span key={c} className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${f.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {f.status === 'Ativo' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-all"
                        title="Editar Fornecedor"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2.5 p-4 border border-amber-100 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10 rounded-xl text-xs text-amber-800 dark:text-amber-400">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
        <div className="space-y-1">
          <p className="font-bold">Módulo de Integração Ativo (R042)</p>
          <p>Esses dados estão salvos e simulados localmente. O sistema de buscas por Nome Fantasia e CNPJ já está totalmente funcional, permitindo a gestão e validação de unicidade de dados do Gestor de Estoque.</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full shadow-xl space-y-4 my-8">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              {editingId ? 'Editar Cadastro de Fornecedor' : 'Novo Cadastro de Fornecedor'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Razão Social *</label>
                  <input type="text" placeholder="Ex: Alpha Vestuários LTDA" value={formData.razaoSocial} onChange={(e) => setFormData(p => ({ ...p, razaoSocial: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Fantasia *</label>
                  <input type="text" placeholder="Ex: Distribuidora Alpha" value={formData.nomeFantasia} onChange={(e) => setFormData(p => ({ ...p, nomeFantasia: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">CNPJ (Com Máscara) *</label>
                  <input type="text" placeholder="00.000.000/0001-00" value={formData.cnpj} onChange={handleCnpjChange} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Inscrição Estadual</label>
                  <input type="text" placeholder="Ex: 123.456.789" value={formData.inscricaoEstadual} onChange={(e) => setFormData(p => ({ ...p, inscricaoEstadual: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail de Pedidos *</label>
                  <input type="email" placeholder="pedidos@empresa.com" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone Comercial *</label>
                  <input type="text" placeholder="(11) 99999-9999" value={formData.telefone} onChange={(e) => setFormData(p => ({ ...p, telefone: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Endereço Completo de Entrega</label>
                  <input type="text" placeholder="Rua, Número, Bairro, Cidade/UF" value={formData.endereco} onChange={(e) => setFormData(p => ({ ...p, endereco: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Vendedor Responsável</label>
                  <input type="text" placeholder="Ex: Roberto Carlos" value={formData.nomeVendedor} onChange={(e) => setFormData(p => ({ ...p, nomeVendedor: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status do Fornecedor</label>
                  <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as 'Ativo' | 'Inativo' }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                    <option value="Ativo">🟢 Ativo (Permite Pedidos)</option>
                    <option value="Inativo">🔴 Inativo (Bloqueado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Categorias Atendidas (Selecione Múltiplas)</label>
                <div className="flex flex-wrap gap-2">
                  {['Alimentos', 'Limpeza', 'Bebidas', 'Vestuário', 'Eletrônicos'].map(cat => {
                    const isSelected = formData.categorias.includes(cat)
                    return (
                      <button key={cat} type="button" onClick={() => toggleCategoria(cat)} className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Observações Operacionais</label>
                <textarea rows={2} placeholder="Ex: Entregas apenas na parte da manhã ou restrições de faturamento..." value={formData.observacoes} onChange={(e) => setFormData(p => ({ ...p, observacoes: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 resize-none" />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all">
                  <Save className="h-4 w-4" /> Salvar Alterações
                </button>
                <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}