'use client'

import { useState, useRef } from 'react'
import { Package, Plus, Search, Tag, X, AlertCircle, CheckCircle2, Edit2, Trash2, Filter, Layers, Image as ImageIcon, Camera, UploadCloud } from 'lucide-react'

// Interfaces que modelam as regras R036 (Categorias) e R038 (Fotos)
interface Categoria {
  id: string
  nome: string
}

interface Produto {
  id: number
  codigo: string
  nome: string
  preco: number
  quantidade: number
  categoriaId: string
  fotoUrl?: string // URL ou Base64 da imagem anexada (R038)
}

export default function ProdutosPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Banco de dados mockado de Categorias (R036)
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: '1', nome: 'Bebidas' },
    { id: '2', nome: 'Limpeza' },
    { id: '3', nome: 'Alimentos' },
  ])

  // 2. Banco de dados mockado de Produtos (R038 - com imagens iniciais simuladas)
  const [produtos, setProdutos] = useState<Produto[]>([
    { id: 1, codigo: 'PROD001', nome: 'Refrigerante Cola 2L', preco: 8.50, quantidade: 24, categoriaId: '1', fotoUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&q=80' },
    { id: 2, codigo: 'PROD002', nome: 'Detergente Neutro 500ml', preco: 2.20, quantidade: 50, categoriaId: '2', fotoUrl: '' },
    { id: 3, codigo: 'PROD003', nome: 'Arroz Integral 1kg', preco: 6.90, quantidade: 15, categoriaId: '3', fotoUrl: '' },
  ])

  // Estados para controle de Telas/Modais
  const [isModalProdOpen, setIsModalProdOpen] = useState(false)
  const [isModalCatOpen, setIsModalCatOpen] = useState(false)

  // Filtros ativos
  const [termoBusca, setTermoBusca] = useState('')
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<string>('todos')

  // Estados do Formulário de Produtos (Unificado R036 + R038)
  const [prodIdEdicao, setProdIdEdicao] = useState<number | null>(null)
  const [prodCodigo, setProdCodigo] = useState('')
  const [prodNome, setProdNome] = useState('')
  const [prodPreco, setProdPreco] = useState('')
  const [prodQuantidade, setProdQuantidade] = useState('')
  const [prodCategoriaId, setProdCategoriaId] = useState('')
  const [prodFotoUrl, setProdFotoUrl] = useState<string>('') // R038

  // Estados do Formulário de Categorias
  const [catNome, setCatNome] = useState('')
  const [catIdEdicao, setCatIdEdicao] = useState<string | null>(null)

  // Alertas e Mensagens
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [avisoCategoria, setAvisoCategoria] = useState('')

  // --- LÓGICA DE NEGÓCIO: UPLOAD E VALIDAÇÃO DE IMAGEM (R038) ---
  const handleTrocaImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErro('')
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    // Validação de formato (Fluxo Alternativo: Formato Inválido)
    const formatosAceitos = ['image/jpeg', 'image/png', 'image/jpg']
    if (!formatosAceitos.includes(arquivo.type)) {
      setErro('Formato de arquivo não suportado. Use apenas JPG ou PNG')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Otimização e Conversão em Base64 para simulação local rápida (Critério 3)
    const leitor = new FileReader()
    leitor.onloadend = () => {
      setProdFotoUrl(leitor.result as string)
      setSucesso('Imagem carregada e otimizada automaticamente para o PDV! ⚡')
      setTimeout(() => setSucesso(''), 2500)
    }
    leitor.readAsDataURL(arquivo)
  }

  const removerImagemFormulario = () => {
    // Fluxo Alternativo: Remover vínculo da imagem
    setProdFotoUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // --- LÓGICA DE NEGÓCIO: GESTÃO DE CATEGORIAS (R036) ---
  const handleSalvarCategoria = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catNome.trim()) return

    if (catIdEdicao) {
      setCategorias(categorias.map(cat => cat.id === catIdEdicao ? { ...cat, nome: catNome.trim() } : cat))
      setSucesso('Categoria atualizada com sucesso!')
      setCatIdEdicao(null)
    } else {
      const novaCat: Categoria = { id: Date.now().toString(), nome: catNome.trim() }
      setCategorias([...categorias, novaCat])
      setSucesso('Nova categoria adicionada!')
    }
    setCatNome('')
    setTimeout(() => setSucesso(''), 2000)
  }

  const handleExcluirCategoria = (id: string) => {
    const possuiProdutos = produtos.some(p => p.categoriaId === id)
    if (possuiProdutos) {
      setAvisoCategoria("Existem produtos nesta categoria. Mova-os antes de excluir ou a categoria deles ficará como 'Sem Categoria'.")
      setProdutos(produtos.map(p => p.categoriaId === id ? { ...p, categoriaId: '' } : p))
    }
    setCategorias(categorias.filter(cat => cat.id !== id))
    if (categoriaFiltrada === id) setCategoriaFiltrada('todos')
  }

  // --- LÓGICA DE NEGÓCIO: GESTÃO DE PRODUTOS ---
  const handleSalvarProduto = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!prodCodigo.trim() || !prodNome.trim() || !prodPreco || !prodQuantidade) {
      setErro('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    if (prodIdEdicao) {
      setProdutos(produtos.map(p => p.id === prodIdEdicao ? {
        ...p,
        codigo: prodCodigo.trim(),
        nome: prodNome.trim(),
        preco: parseFloat(prodPreco),
        quantidade: parseInt(prodQuantidade),
        categoriaId: prodCategoriaId,
        fotoUrl: prodFotoUrl // Salva URL da Imagem (R038)
      } : p))
      setSucesso('Produto atualizado com sucesso!')
    } else {
      const novoProd: Produto = {
        id: Date.now(),
        codigo: prodCodigo.trim(),
        nome: prodNome.trim(),
        preco: parseFloat(prodPreco),
        quantidade: parseInt(prodQuantidade),
        categoriaId: prodCategoriaId,
        fotoUrl: prodFotoUrl // Salva URL da Imagem (R038)
      }
      setProdutos([novoProd, ...produtos])
      setSucesso('Produto cadastrado e categorizado!')
    }

    setTimeout(() => {
      setIsModalProdOpen(false)
      resetFormProduto()
    }, 1500)
  }

  const resetFormProduto = () => {
    setProdIdEdicao(null)
    setProdCodigo('')
    setProdNome('')
    setProdPreco('')
    setProdQuantidade('')
    setProdCategoriaId('')
    setProdFotoUrl('')
    setErro('')
    setSucesso('')
  }

  const abrirEdicaoProduto = (p: Produto) => {
    setProdIdEdicao(p.id)
    setProdCodigo(p.codigo)
    setProdNome(p.nome)
    setProdPreco(p.preco.toString())
    setProdQuantidade(p.quantidade.toString())
    setProdCategoriaId(p.categoriaId)
    setProdFotoUrl(p.fotoUrl || '')
    setIsModalProdOpen(true)
  }

  // Filtros (R036)
  const produtosFiltrados = produtos.filter(p => {
    const atendeBusca = p.nome.toLowerCase().includes(termoBusca.toLowerCase()) || p.codigo.toLowerCase().includes(termoBusca.toLowerCase())
    const atendeCategoria = categoriaFiltrada === 'todos' || p.categoriaId === categoriaFiltrada
    return atendeBusca && atendeCategoria
  })

  return (
    <div className="space-y-6">
      {/* Topo da Tela */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Controle de Estoque</h1>
          <p className="text-sm text-slate-500">Gerencie itens com fotos integradas para agilizar a identificação na hora da venda.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAvisoCategoria(''); setIsModalCatOpen(true) }}
            className="flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <Layers className="h-4 w-4 text-slate-400" />
            Categorias
          </button>
          <button
            onClick={() => { resetFormProduto(); setIsModalProdOpen(true) }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Painel de Pesquisa e Filtros (R036) */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Pesquisar por nome do item ou código de barras..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-slate-400 hidden md:block" />
          <select
            value={categoriaFiltrada}
            onChange={(e) => setCategoriaFiltrada(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="todos">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
            <option value="">Sem Categoria</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards de Produtos (R038: Identidade Visual) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((p) => {
            const categoriaDoProduto = categorias.find(c => c.id === p.categoriaId)?.nome || 'Sem Categoria'
            return (
              <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden">
                
                {/* Imagem do Produto/Thumbnail para a vitrine */}
                <div className="h-40 w-full bg-slate-100 relative flex items-center justify-center border-b border-slate-100 shrink-0">
                  {p.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.fotoUrl} alt={p.nome} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 flex flex-col items-center gap-1.5">
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                      <span className="text-xs font-medium">Sem imagem vinculada</span>
                    </div>
                  )}
                  <span className="absolute left-3 bottom-3 text-[10px] bg-slate-900/70 backdrop-blur-xs text-white font-mono px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    {p.codigo}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-800 text-base leading-tight">{p.nome}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-wide flex items-center gap-1 shrink-0 ${
                        p.categoriaId ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        <Tag className="h-2.5 w-2.5" />
                        {categoriaDoProduto}
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Preço de Venda</p>
                        <p className="text-lg font-extrabold text-slate-900">
                          {p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Qtd. Estoque</p>
                        <p className={`text-sm font-bold ${p.quantidade <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {p.quantidade} un
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex justify-end">
                    <button 
                      onClick={() => abrirEdicaoProduto(p)}
                      className="flex items-center gap-1 text-slate-500 hover:text-blue-600 text-xs font-semibold p-1.5 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <Edit2 className="h-3 w-3" /> Editar Produto
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full bg-slate-50 text-center py-12 rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
            Nenhum item localizado no inventário correspondente aos filtros.
          </div>
        )}
      </div>

      {/* 📦 MODAL: CADASTRO / EDIÇÃO COM UPLOAD FOTOGRÁFICO (R038) */}
      {isModalProdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Package className="h-5 w-5 text-blue-600" />
                <h2 className="font-bold text-lg">{prodIdEdicao ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
              </div>
              <button onClick={() => setIsModalProdOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarProduto} className="p-6 space-y-4 overflow-y-auto flex-1">
              {erro && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{erro}</span>
                </div>
              )}
              {sucesso && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 p-3 rounded-xl text-xs font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{sucesso}</span>
                </div>
              )}

              {/* 📸 ÁREA DE UPLOAD DE FOTO (R038 - CRITÉRIO 1 E FLUXOS ALTERNATIVOS) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Identificação Visual do Item</label>
                
                {prodFotoUrl ? (
                  // Fluxo Principal 5: Prévia da imagem selecionada
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prodFotoUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removerImagemFormulario}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-700 transition-colors"
                      title="Remover Imagem"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  // Fluxo Principal 3: Área de clique para Upload/Câmera móvel
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-36 w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
                  >
                    <div className="p-2.5 bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 rounded-full transition-colors">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Clique para enviar imagem</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Formatos suportados: JPG ou PNG</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full mt-1">
                      <Camera className="h-3 w-3" />
                      <span>Suporta câmera do celular</span>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleTrocaImagem} 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Código/SKU *</label>
                  <input
                    type="text"
                    value={prodCodigo}
                    onChange={(e) => setProdCodigo(e.target.value)}
                    placeholder="Ex: PROD90"
                    disabled={prodIdEdicao !== null}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono text-slate-800 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria (R036)</label>
                  <select
                    value={prodCategoriaId}
                    onChange={(e) => setProdCategoriaId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden"
                  >
                    <option value="">Nenhuma (Sem Setor)</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Item *</label>
                <input
                  type="text"
                  value={prodNome}
                  onChange={(e) => setProdNome(e.target.value)}
                  placeholder="Ex: Sabão em Pó Brilhante 1kg"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodPreco}
                    onChange={(e) => setProdPreco(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estoque Inicial *</label>
                  <input
                    type="number"
                    value={prodQuantidade}
                    onChange={(e) => setProdQuantidade(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalProdOpen(false)}
                  className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Salvar No Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📁 MODAL: GESTÃO AUTÔNOMA DE CATEGORIAS (R036) */}
      {isModalCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Layers className="h-5 w-5 text-blue-600" />
                <h2 className="font-bold text-lg">Gerenciar Categorias</h2>
              </div>
              <button onClick={() => setIsModalCatOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {avisoCategoria && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{avisoCategoria}</span>
                </div>
              )}

              <form onSubmit={handleSalvarCategoria} className="flex gap-2">
                <input
                  type="text"
                  value={catNome}
                  onChange={(e) => setCatNome(e.target.value)}
                  placeholder="Nome do grupo (ex: Hortifruti)"
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-hidden"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                  {catIdEdicao ? 'Salvar' : 'Adicionar'}
                </button>
              </form>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Setores Ativos</p>
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
                  {categorias.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between px-4 py-2.5 bg-slate-50/40 hover:bg-slate-50 text-sm font-medium text-slate-700">
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setCatIdEdicao(cat.id); setCatNome(cat.name); }} className="p-1 text-slate-400 hover:text-blue-600 rounded-md">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleExcluirCategoria(cat.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded-md">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}