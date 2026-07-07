'use client'

import { useState } from 'react'
import { Users, Plus, Search, FileText, CheckCircle2, AlertCircle, Clock, Download, ShoppingBag, ShieldAlert, Ban } from 'lucide-react'

// Interface estendida para suportar R072 (Crédito) e R073 (Inatividade/Marketing)
interface Cliente {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string            // R073 (Critério 2)
  statusFidelidade: string
  pontos: number
  // R072: Crédito
  limiteCredito: number
  creditoUtilizado: number
  possuiAtrasos: boolean
  // R073: Inatividade & LTV
  dataUltimaCompra: string    // R073 (Critério 2)
  diasInativo: number         // R073 (Critério 1)
  ltvTotalGasto: number       // R073 (Critério 3)
  ticketMedio: number         // R073 (Critério 7)
  categoriaPreferida: string  // R073 (Critério 4)
  statusMarketing: 'ativo' | 'inativo_permanente' | 'mudou_se' // R073 (Critério 6)
}

interface LancamentoExtrato {
  id: number
  data: string
  tipo: 'compra' | 'pagamento'
  descricao: string
  valor: number
}

export default function ClientesPage() {
  // 1. Banco de dados inicial simulado integrando limites de crédito e histórico de compras/inatividade
  const [clientes, setClientes] = useState<Cliente[]>([
    { 
      id: 1, 
      nome: 'Maria Souza', 
      cpf: '123.456.789-00', 
      email: 'maria@email.com', 
      telefone: '(11) 98888-1111',
      statusFidelidade: 'Ouro', 
      pontos: 450, 
      limiteCredito: 500.00, 
      creditoUtilizado: 420.00, 
      possuiAtrasos: false,
      dataUltimaCompra: '10/01/2026', // Simulando base em Julho de 2026 (Inativa há 177 dias)
      diasInativo: 177,
      ltvTotalGasto: 1540.00,
      ticketMedio: 220.00,
      categoriaPreferida: 'Bebidas',
      statusMarketing: 'ativo'
    },
    { 
      id: 2, 
      nome: 'Carlos Lima', 
      cpf: '987.654.321-11', 
      email: 'carlos@email.com', 
      telefone: '(11) 97777-2222',
      statusFidelidade: 'Prata', 
      pontos: 180, 
      limiteCredito: 300.00, 
      creditoUtilizado: 50.00, 
      possuiAtrasos: true,
      dataUltimaCompra: '15/04/2026', // Inativo há 82 dias
      diasInativo: 82,
      ltvTotalGasto: 480.00,
      ticketMedio: 120.00,
      categoriaPreferida: 'Limpeza',
      statusMarketing: 'ativo'
    },
    { 
      id: 3, 
      nome: 'Ana Costa', 
      cpf: '456.789.123-22', 
      email: 'ana@email.com', 
      telefone: '(11) 96666-3333',
      statusFidelidade: 'Bronze', 
      pontos: 50, 
      limiteCredito: 1000.00, 
      creditoUtilizado: 0.00, 
      possuiAtrasos: false,
      dataUltimaCompra: '02/07/2026', // Ativa (Inativa há 4 dias)
      diasInativo: 4,
      ltvTotalGasto: 2400.00,
      ticketMedio: 400.00,
      categoriaPreferida: 'Alimentos',
      statusMarketing: 'ativo'
    },
  ])

  // Histórico de extrato da conta corrente de um cliente selecionado (R072)
  const [extrato, setExtrato] = useState<LancamentoExtrato[]>([
    { id: 1, data: '18/06/2026', tipo: 'compra', descricao: 'Compra a Prazo - Cupom #4012', valor: 350.00 },
    { id: 2, data: '25/06/2026', tipo: 'compra', descricao: 'Compra a Prazo - Cupom #4189', valor: 70.00 },
  ])

  // Modais de Controle
  const [isModalNovoOpen, setIsModalNovoOpen] = useState(false)
  const [isModalExtratoOpen, setIsModalExtratoOpen] = useState(false)
  const [isModalQuitarOpen, setIsModalQuitarOpen] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)

  // Filtros Globais & Controle de Modos de Visualização (Geral vs Relatório de Inatividade)
  const [modoVisao, setModoVisao] = useState<'geral' | 'inatividade'>('geral')
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroRisco, setFiltroRisco] = useState<'todos' | 'proximos_limite' | 'bloqueados'>('todos')

  // --- FILTROS ESPECÍFICOS DO RELATÓRIO DE INATIVIDADE (R073) ---
  const [periodoInatividade, setPeriodoInatividade] = useState<string>('90') // Critério 1 (30, 60, 90, 180)
  const [filtroCategoriaHabito, setFiltroCategoriaHabito] = useState<string>('todas') // Critério 4
  const [ordenacaoInativo, setOrdenacaoInativo] = useState<'mais_antigo' | 'mais_recente'>('mais_antigo') // Critério 8

  // Parâmetros do Formulário de Cadastro
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [statusFidelidade, setStatusFidelidade] = useState('Bronze')
  const [limiteCredito, setLimiteCredito] = useState('')
  const [possuiAtrasos, setPossuiAtrasos] = useState(false)
  const [categoriaPreferida, setCategoriaPreferida] = useState('Alimentos')

  const [valorPagamento, setValorPagamento] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')

  // MOCK DE FLUXO ALTERNATIVO 1: Alerta sobre precisão de dados de vendas identificadas
  const percentualVendasAnonimas = 22 

  // --- LÓGICA DE NEGÓCIO R073: EXPORTAÇÃO CSV COMPATÍVEL COM TRANSMISSÃO (Critério 5) ---
  const handleExportarInativos = () => {
    const alvos = obterClientesInativosFiltrados()
    if (alvos.length === 0) {
      alert('Nenhum cliente na listagem atual para exportar.')
      return
    }

    const cabecalho = 'Nome,Telefone,Email,Dias Inativo,LTV Total Gasto\n'
    const linhas = alvos.map(c => `"${c.nome}","${c.telefone}","${c.email}",${c.diasInativo},${c.ltvTotalGasto}`).join('\n')
    const conteudoCsv = 'data:text/csv;charset=utf-8,' + cabecalho + linhas

    const uriCodificada = encodeURI(conteudoCsv)
    const linkDownload = document.createElement('a')
    linkDownload.setAttribute('href', uriCodificada)
    linkDownload.setAttribute('download', `clientes_inativos_${periodoInatividade}_dias.csv`)
    document.body.appendChild(linkDownload)
    linkDownload.click()
    document.body.removeChild(linkDownload)

    setSucesso('Arquivo CSV exportado com sucesso! 🚀')
    setTimeout(() => setSucesso(''), 3000)
  }

  // --- LÓGICA DE NEGÓCIO R073: EXCLUSÃO PERMANENTE DE MARKETING (Critério 6) ---
  const handleAlterarStatusMarketing = (id: number, novoStatus: 'ativo' | 'inativo_permanente' | 'mudou_se') => {
    setClientes(clientes.map(c => c.id === id ? { ...c, statusMarketing: novoStatus } : c))
    setSucesso('Preferência de marketing atualizada com sucesso.')
    setTimeout(() => setSucesso(''), 2000)
  }

  // --- FUNÇÃO AUXILIAR: FILTRAGEM DO RELATÓRIO DE INATIVIDADE (R073) ---
  const obterClientesInativosFiltrados = () => {
    return clientes.filter(c => {
      if (c.statusMarketing !== 'ativo') return false
      const limiteDias = parseInt(periodoInatividade)
      const atendeDias = c.diasInativo >= limiteDias
      const atendeCategoria = filtroCategoriaHabito === 'todas' || c.categoriaPreferida === filtroCategoriaHabito
      const atendeBusca = c.nome.toLowerCase().includes(termoBusca.toLowerCase()) || c.cpf.includes(termoBusca)

      return atendeDias && atendeCategoria && atendeBusca
    }).sort((a, b) => {
      return ordenacaoInativo === 'mais_antigo' ? b.diasInativo - a.diasInativo : a.diasInativo - b.diasInativo
    })
  }

  // --- FILTRAGEM DA LISTAGEM GERAL (R072) ---
  const clientesGeraisFiltrados = clientes.filter(c => {
    const atendeBusca = c.nome.toLowerCase().includes(termoBusca.toLowerCase()) || c.cpf.includes(termoBusca)
    if (filtroRisco === 'proximos_limite') {
      const percentualUtilizado = c.limiteCredito > 0 ? (c.creditoUtilizado / c.limiteCredito) * 100 : 0
      return atendeBusca && percentualUtilizado >= 80
    }
    if (filtroRisco === 'bloqueados') {
      return atendeBusca && (c.possuiAtrasos || c.creditoUtilizado >= c.limiteCredito)
    }
    return atendeBusca
  })

  // --- CADASTRO DE NOVO CLIENTE ---
  const handleCadastrarCliente = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim() || !cpf.trim() || !telefone.trim()) {
      setErro('Nome, CPF e Telefone são campos obrigatórios.')
      return
    }

    const novoCliente: Cliente = {
      id: Date.now(),
      nome: nome.trim(),
      cpf: cpf.trim(),
      email: email.trim() || 'Não informado',
      telefone: telephone = telefone.trim(),
      statusFidelidade,
      pontos: 0,
      limiteCredito: limiteCredito ? parseFloat(limiteCredito) : 0,
      creditoUtilizado: 0,
      possuiAtrasos: possuiAtrasos,
      dataUltimaCompra: new Date().toLocaleDateString('pt-BR'),
      diasInativo: 0,
      ltvTotalGasto: 0,
      ticketMedio: 0,
      categoriaPreferida: categoriaPreferida,
      statusMarketing: 'ativo'
    }

    setClientes([novoCliente, ...clientes])
    setSucesso('Cliente registrado no sistema!')
    setTimeout(() => {
      setIsModalNovoOpen(false)
      limparFormulario()
    }, 1500)
  }

  const handleRegistrarPagamento = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteSelecionado || !valorPagamento) return

    const valor = parseFloat(valorPagamento)
    if (valor <= 0 || valor > clienteSelecionado.creditoUtilizado) {
      alert('Valor de pagamento inválido.')
      return
    }

    setClientes(clientes.map(c => c.id === clienteSelecionado.id ? {
      ...c,
      creditoUtilizado: c.creditoUtilizado - valor,
      possuiAtrasos: c.creditoUtilizado - valor === 0 ? false : c.possuiAtrasos
    } : c))

    const novoLancamento: LancamentoExtrato = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      tipo: 'pagamento',
      descricao: 'Recebimento em Caixa - Abatimento Fiado',
      valor: valor
    }
    setExtrato([novoLancamento, ...extrato])

    setSucesso('Pagamento processado e crédito restabelecido!')
    setValorPagamento('')
    setTimeout(() => {
      setSucesso('')
      setIsModalQuitarOpen(false)
    }, 1500)
  }

  const abrirModalQuitar = (c: Cliente) => {
    setClienteSelecionado(c)
    setIsModalQuitarOpen(true)
  }

  const abrirPainelExtrato = (c: Cliente) => {
    setClienteSelecionado(c)
    setIsModalExtratoOpen(true)
  }

  const limparFormulario = () => {
    setNome('')
    setCpf('')
    setEmail('')
    setTelefone('')
    setStatusFidelidade('Bronze')
    setLimiteCredito('')
    setPossuiAtrasos(false)
    setCategoriaPreferida('Alimentos')
    setErro('')
    setSucesso('')
  }

  return (
    <div className="space-y-6">
      {/* Notificação de Feedback Global */}
      {sucesso && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-lg">
          <CheckCircle2 className="h-5 w-5" />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Topo Dinâmico */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Gestão de Clientes</h1>
          <p className="text-sm text-slate-500">Acompanhe limites de crédito para vendas no fiado e gerencie campanhas para clientes inativos.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Alternadores de Visão (Geral R072 vs Inatividade R073) */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-bold border border-slate-200">
            <button 
              onClick={() => { setModoVisao('geral'); setTermoBusca(''); }}
              className={`px-3 py-2 rounded-lg transition-all ${modoVisao === 'geral' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Carteira Geral
            </button>
            <button 
              onClick={() => { setModoVisao('inatividade'); setTermoBusca(''); }}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${modoVisao === 'inatividade' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Clock className="h-3.5 w-3.5" />
              Relatório de Inatividade
            </button>
          </div>
          
          <button
            onClick={() => { limparFormulario(); setIsModalNovoOpen(true) }}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Cliente
          </button>
        </div>
      </div>

      {/* --- MODO DE VISÃO 1: CARTEIRA GERAL & CRÉDITO (R072) --- */}
      {modoVisao === 'geral' && (
        <>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Pesquisar cliente por nome ou CPF..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button onClick={() => setFiltroRisco('todos')} className={`px-3 py-1.5 rounded-md ${filtroRisco === 'todos' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}>Todos</button>
              <button onClick={() => setFiltroRisco('proximos_limite')} className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${filtroRisco === 'proximos_limite' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}><ShieldAlert className="h-3.5 w-3.5" /> Próximos ao Limite</button>
              <button onClick={() => setFiltroRisco('bloqueados')} className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${filtroRisco === 'bloqueados' ? 'bg-rose-600 text-white' : 'text-slate-500'}`}><Ban className="h-3.5 w-3.5" /> Bloqueados / Atrasos</button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Cliente</th>
                    <th className="px-6 py-3.5">Contato</th>
                    <th className="px-6 py-3.5">Limite de Crédito</th>
                    <th className="px-6 py-3.5">Crédito Utilizado</th>
                    <th className="px-6 py-3.5">Crédito Disponível</th>
                    <th className="px-6 py-3.5">Situação Fiado</th>
                    <th className="px-6 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {clientesGeraisFiltrados.map((c) => {
                    const disponivel = c.limiteCredito - c.creditoUtilizado
                    const pct = c.limiteCredito > 0 ? (c.creditoUtilizado / c.limiteCredito) * 100 : 0
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{c.nome}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{c.cpf}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{c.telefone}<br/>{c.email}</td>
                        <td className="px-6 py-4 font-semibold">{c.limiteCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${pct >= 80 ? 'text-amber-600' : 'text-slate-600'}`}>{c.creditoUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          <div className="w-20 bg-slate-100 h-1 rounded-full mt-1"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">{disponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="px-6 py-4">
                          {c.possuiAtrasos ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm bg-rose-50 text-rose-600 border border-rose-100">Bloqueado por Atraso</span>
                          ) : pct >= 100 ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm bg-slate-100 text-slate-500">Esgotado</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm bg-emerald-50 text-emerald-600">Liberado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {c.creditoUtilizado > 0 && <button onClick={() => abrirModalQuitar(c)} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 rounded-md py-1">Quitar</button>}
                          <button onClick={() => abrirPainelExtrato(c)} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 border border-slate-200 px-2 rounded-md py-1 hover:bg-slate-50"><FileText className="h-3 w-3" /> Extrato</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* --- MODO DE VISÃO 2: FILTRAR CLIENTES INATIVOS & MARKETING (R073) --- */}
      {modoVisao === 'inatividade' && (
        <>
          {/* Fluxo Alternativo 1: Indicador de Vendas sem Identificação */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Aviso de Precisão do Relatório (Métricas de Caixa)</p>
              <p className="text-xs text-amber-700/90 mt-0.5">
                Atenção: <strong>{percentualVendasAnonimas}% das suas vendas históricas</strong> foram concluídas como &quot;Consumidor Final&quot; (sem identificação de CPF). Para campanhas de marketing 100% precisas, incentive a identificação do cliente no PDV.
              </p>
            </div>
          </div>

          {/* Barra Avançada de Parâmetros e Filtros de Inatividade */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Critério 1: Definição da Janela de Inatividade */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Janela de Tempo Sem Comprar</label>
              <select
                value={periodoInatividade}
                onChange={(e) => setPeriodoInatividade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="30">Inativos há +30 dias (Aviso Prévio)</option>
                <option value="60">Inativos há +60 dias (Alerta Médio)</option>
                <option value="90">Inativos há +90 dias (Crítico - 3 meses)</option>
                <option value="180">Inativos há +180 dias (Alto Risco de Perda)</option>
              </select>
            </div>

            {/* Critério 4: Preferência de Categoria Histórica */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Hábito de Consumo Histórico</label>
              <select
                value={filtroCategoriaHabito}
                onChange={(e) => setFiltroCategoriaHabito(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="todas">Todas os Setores Comprados</option>
                <option value="Bebidas">Clientes de Bebidas</option>
                <option value="Limpeza">Clientes de Limpeza</option>
                <option value="Alimentos">Clientes de Alimentos</option>
              </select>
            </div>

            {/* Critério 8: Ordenação Cronológica de Abandono */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Ordem de Prioridade na Tela</label>
              <select
                value={ordenacaoInativo}
                onChange={(e) => setOrdenacaoInativo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="mais_antigo">Do mais afastado (Maior Abandono)</option>
                <option value="mais_recente">Do mais recente (Recém-Inativo)</option>
              </select>
            </div>

            {/* Critério 5: Botão de Ação para Exportação Imediata */}
            <div className="flex items-end">
              <button
                onClick={handleExportarInativos}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar Lista (WhatsApp / CSV)
              </button>
            </div>
          </div>

          {/* Listagem do Relatório de Inatividade */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Cliente / Telefone (Critério 2)</th>
                    <th className="px-6 py-3.5">Última Compra (Critério 2)</th>
                    <th className="px-6 py-3.5">Tempo Ocioso</th>
                    <th className="px-6 py-3.5">LTV - Total Gasto (Critério 3)</th>
                    <th className="px-6 py-3.5">Ticket Médio (Critério 7)</th>
                    <th className="px-6 py-3.5">Setor de Interesse (Critério 4)</th>
                    <th className="px-6 py-3.5 text-right">Higienização de Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {obterClientesInativosFiltrados().length > 0 ? (
                    obterClientesInativosFiltrados().map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/40">
                        {/* Critério 2: Dados cadastrais completos */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{c.nome}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{c.telefone}</p>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </td>
                        {/* Critério 2: Data da última compra registrada */}
                        <td className="px-6 py-4 text-xs font-medium text-slate-700">
                          {c.dataUltimaCompra}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold ${c.diasInativo >= 90 ? 'text-rose-600' : 'text-amber-600'}`}>
                            {c.diasInativo} dias sem vir
                          </span>
                        </td>
                        {/* Critério 3: LTV acumulado para priorização de reativação VIP */}
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {c.ltvTotalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        {/* Critério 7: Ticket Médio Histórico */}
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {c.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        {/* Critério 4: Categoria alvo */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                            <ShoppingBag className="h-2.5 w-2.5" />
                            {c.categoriaPreferida}
                          </span>
                        </td>
                        {/* Critério 6: Higienização e Status permanente */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => handleAlterarStatusMarketing(c.id, 'inativo_permanente')}
                              className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors"
                              title="Marcar como Inativo Permanente"
                            >
                              Inativo Fixo
                            </button>
                            <button
                              onClick={() => handleAlterarStatusMarketing(c.id, 'mudou_se')}
                              className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              title="Marcar como Mudou-se ou Falecido"
                            >
                              Mudou-se
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        Nenhum cliente inativo atende a combinação de filtros selecionada. Excelente sinal!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 📦 MODAL R072: NOVO CADASTRO DE CLIENTE */}
      {isModalNovoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="font-bold text-lg">Novo Cadastro de Cliente</h2>
              </div>
            </div>

            <form onSubmit={handleCadastrarCliente} className="p-6 space-y-3">
              {erro && <div className="bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5"><AlertCircle className="h-4 w-4" />{erro}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Lucas Ribeiro" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CPF *</label>
                  <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone (WhatsApp) *</label>
                  <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-0000" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria de Interesse</label>
                  <select value={categoriaPreferida} onChange={(e) => setCategoriaPreferida(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden">
                    <option value="Alimentos">Alimentos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Limpeza">Limpeza</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parâmetros de Crédito (Fiado - R072)</p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Limite Autorizado (R$)</label>
                  <input type="number" step="0.01" value={limiteCredito} onChange={(e) => setLimiteCredito(e.target.value)} placeholder="0,00" className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden font-semibold" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalNovoOpen(false)} className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📦 MODAL R072: EXTRATO INTEGRADO */}
      {isModalExtratoOpen && clienteSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Extrato de Conta Corrente</h3>
                <p className="text-xs text-slate-400">Cliente: {clienteSelecionado.nome}</p>
              </div>
              <button onClick={() => setIsModalExtratoOpen(false)} className="text-slate-400 hover:text-slate-600">Fechar</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Dívida</p><p className="text-base font-extrabold text-slate-800">{clienteSelecionado.creditoUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Disponível</p><p className="text-base font-extrabold text-emerald-600">{(clienteSelecionado.limiteCredito - clienteSelecionado.creditoUtilizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {extrato.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg text-xs">
                    <div><p className="font-bold text-slate-700">{item.descricao}</p><p className="text-[10px] text-slate-400">{item.data}</p></div>
                    <span className="font-bold text-slate-700">{item.tipo === 'compra' ? '+' : '-'}{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📦 MODAL R072: QUITAÇÃO */}
      {isModalQuitarOpen && clienteSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-5 border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Registrar Recebimento</h3>
            <p className="text-xs text-slate-500">Cliente: <strong>{clienteSelecionado.nome}</strong><br/>Dívida: <strong className="text-rose-600">{clienteSelecionado.creditoUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
            <form onSubmit={handleRegistrarPagamento} className="space-y-3">
              <input type="number" step="0.01" max={clienteSelecionado.creditoUtilizado} value={valorPagamento} onChange={(e) => setValorPagamento(e.target.value)} placeholder="0,00" required className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-hidden" />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsModalQuitarOpen(false)} className="text-xs text-slate-500">Voltar</button><button type="submit" className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-md">Confirmar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}