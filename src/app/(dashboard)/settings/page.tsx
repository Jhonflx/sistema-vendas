'use client'

import { useState, useEffect } from 'react'
import { Eye, Moon, Sun, Monitor, FileText, Upload, RefreshCw, Printer, Save, Smartphone, Globe, Database, Lock, ShieldCheck, Download } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  // Estados dos requisitos anteriores (Acessibilidade, Tema e Comprovante)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light')
  const [receiptConfig, setReceiptConfig] = useState({
    nomeFantasia: 'SGPV - Minha Loja',
    cnpj: '00.000.000/0001-00',
    endereco: 'Rua das Vendas, 123 - Centro',
    telefone: '(11) 99999-9999',
    mensagemRodape: 'Obrigado pela preferência! Não trocamos produtos sem etiqueta.',
    mostrarCpf: true,
    instagram: '@minhaloja',
    whatsapp: '(11) 99999-9999',
    tamanhoPapel: '80mm',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // REQUISITO R064: Estados do Backup Manual
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [lastBackupTime, setLastBackupTime] = useState<number | null>(null)

  // Carrega as preferências ao iniciar a página
  useEffect(() => {
    const savedContrast = localStorage.getItem('sgpv-high-contrast') === 'true'
    setIsHighContrast(savedContrast)
    const savedTheme = (localStorage.getItem('sgpv-theme') as 'light' | 'dark' | 'system') || 'light'
    setThemeMode(savedTheme)
    applyTheme(savedTheme, savedContrast)

    const savedReceipt = localStorage.getItem('sgpv-receipt-config')
    if (savedReceipt) setReceiptConfig(JSON.parse(savedReceipt))
    const savedLogo = localStorage.getItem('sgpv-receipt-logo')
    if (savedLogo) setLogoPreview(savedLogo)

    const savedBackupTime = localStorage.getItem('sgpv-last-backup-time')
    if (savedBackupTime) setLastBackupTime(Number(savedBackupTime))
  }, [])

  const applyTheme = (theme: 'light' | 'dark' | 'system', contrastActive: boolean) => {
    const root = document.documentElement
    root.classList.remove('dark', 'high-contrast')
    if (contrastActive) {
      root.classList.add('high-contrast')
      return
    }
    if (theme === 'dark') root.classList.add('dark')
    else if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemPrefersDark) root.classList.add('dark')
    }
  }

  const handleToggleContrast = () => {
    const newValue = !isHighContrast
    setIsHighContrast(newValue)
    applyTheme(themeMode, newValue)
    localStorage.setItem('sgpv-high-contrast', String(newValue))
    toast.success(newValue ? 'Modo de alto contraste ativado' : 'Modo de alto contraste desativado')
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeMode(newTheme)
    applyTheme(newTheme, isHighContrast)
    localStorage.setItem('sgpv-theme', newTheme)
    toast.success('Tema alterado com sucesso')
  }

  const handleReceiptChange = (field: string, value: any) => {
    setReceiptConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      toast.error('Imagem muito grande. Utilize uma imagem de até 500kb')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
      toast.success('Logomarca carregada para visualização!')
    }
    reader.readAsDataURL(file)
  }

  const handleSaveReceipt = () => {
    localStorage.setItem('sgpv-receipt-config', JSON.stringify(receiptConfig))
    if (logoPreview) localStorage.setItem('sgpv-receipt-logo', logoPreview)
    toast.success('Configurações do comprovante salvas com sucesso!')
  }

  const handleResetPattern = () => {
    const defaultPattern = {
      nomeFantasia: 'SGPV - Minha Loja',
      cnpj: '00.000.000/0001-00',
      endereco: 'Rua das Vendas, 123 - Centro',
      telefone: '(11) 99999-9999',
      mensagemRodape: 'Obrigado pela preferência! Não trocamos produtos sem etiqueta.',
      mostrarCpf: true,
      instagram: '@minhaloja',
      whatsapp: '(11) 99999-9999',
      tamanhoPapel: '80mm',
    }
    setReceiptConfig(defaultPattern)
    setLogoPreview(null)
    localStorage.removeItem('sgpv-receipt-config')
    localStorage.removeItem('sgpv-receipt-logo')
    toast.info('Layout restaurado para o padrão original.')
  }

  const handlePrintTest = () => {
    toast.success('Enviando comando de teste para a impressora (' + receiptConfig.tamanhoPapel + ')...')
  }

  // R064: Início do fluxo de backup (Critério 7 - Trava de 30 minutos)
  const handleInitiateBackup = () => {
    if (lastBackupTime) {
      const thirtyMinutes = 30 * 60 * 1000
      const timePassed = Date.now() - lastBackupTime
      if (timePassed < thirtyMinutes) {
        const minutesLeft = Math.ceil((thirtyMinutes - timePassed) / (60 * 1000))
        toast.error(`Limite de segurança atingido. Aguarde ${minutesLeft} minutos para gerar outro backup.`)
        return
      }
    }
    setShowPasswordModal(true)
  }

  // R064: Confirmação da senha e processamento do Dump (Critério 4 e 5)
  const handleConfirmPassword = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulação básica de validação de credencial administrativa
    if (adminPassword !== 'admin123' && adminPassword !== '123456') {
      toast.error('Senha de administrador inválida. Acesso negado.')
      return
    }

    setShowPasswordModal(false)
    setAdminPassword('')
    setIsGeneratingBackup(true)
    setBackupProgress(0)

    // Simula a barra de progresso em segundo plano (Critério 5)
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          executeBackupDownload()
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // R064: Validação de Integridade e Gatilho do Download Físico (Critério 2, 3 e 6)
  const executeBackupDownload = () => {
    setIsGeneratingBackup(false)
    
    // Formata o nome do arquivo dinamicamente (Critério 3): backup_loja_AAAA_MM_DD_HHh.zip
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const filename = `backup_loja_${year}_${month}_${day}_${hours}h.zip`

    try {
      // Simulação da validação do checksum/integridade (Critério 6)
      const dataIntegrityOk = true
      if (!dataIntegrityOk) throw new Error()

      // Cria um gatilho de download nativo do navegador para o arquivo virtual .zip
      const blob = new Blob(["DUMP COMPLETO DA BASE DE DADOS SGPV - BANCO SQL COMPACTADO"], { type: "application/zip" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Salva o momento do backup bem-sucedido (Critério 7)
      const timestamp = Date.now()
      setLastBackupTime(timestamp)
      localStorage.setItem('sgpv-last-backup-time', String(timestamp))

      toast.success('Backup realizado com sucesso! Guarde este arquivo em local seguro.')
    } catch {
      toast.error('Falha ao gerar backup: erro de integridade nos arquivos temporários.')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações do App</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Personalize a interface, as saídas de impressão e gerencie a segurança dos dados.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Seção 1: Tema e Visualização */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs">
            <h2 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" /> Acessibilidade e Visualização
            </h2>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Modo de Alto Contraste</h3>
                <p className="text-xs text-slate-400">Fundo totalmente preto e textos em amarelo/branco.</p>
              </div>
              <button
                onClick={handleToggleContrast}
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${isHighContrast ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${isHighContrast ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Tema do Sistema</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleThemeChange('light')} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${themeMode === 'light' && !isHighContrast ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}><Sun className="h-4 w-4" /> Claro</button>
                <button onClick={() => handleThemeChange('dark')} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${themeMode === 'dark' && !isHighContrast ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}><Moon className="h-4 w-4" /> Noturno</button>
                <button onClick={() => handleThemeChange('system')} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${themeMode === 'system' && !isHighContrast ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}><Monitor className="h-4 w-4" /> Sistema</button>
              </div>
            </div>
          </div>

          {/* Seção 2: Personalização de Comprovante */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-md font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="h-5 w-5 text-blue-600" /> Personalização do Comprovante (Recibo)
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Logomarca da Empresa (PNG/JPG, Máx. 500kb)</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 transition-all">
                  <Upload className="h-4 w-4" /> Escolher Imagem
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoUpload} />
                </label>
                {logoPreview && <p className="text-[11px] text-emerald-600 font-medium">✓ Logomarca carregada</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Fantasia</label>
                <input type="text" value={receiptConfig.nomeFantasia} onChange={(e) => handleReceiptChange('nomeFantasia', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">CNPJ</label>
                <input type="text" value={receiptConfig.cnpj} onChange={(e) => handleReceiptChange('cnpj', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Endereço Completo</label>
                <input type="text" value={receiptConfig.endereco} onChange={(e) => handleReceiptChange('endereco', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone Comercial</label>
                <input type="text" value={receiptConfig.telefone} onChange={(e) => handleReceiptChange('telefone', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tamanho do Papel de Impressão</label>
                <select value={receiptConfig.tamanhoPapel} onChange={(e) => handleReceiptChange('tamanhoPapel', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                  <option value="58mm">Térmico 58mm</option>
                  <option value="80mm">Térmico 80mm</option>
                  <option value="A4">Folha A4</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram da Loja</label>
                <input type="text" value={receiptConfig.instagram} onChange={(e) => handleReceiptChange('instagram', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp</label>
                <input type="text" value={receiptConfig.whatsapp} onChange={(e) => handleReceiptChange('whatsapp', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="md:col-span-2 flex items-center justify-between py-2 bg-slate-50 dark:bg-slate-800/50 px-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Exibir CPF do Cliente</h4>
                  <p className="text-[10px] text-slate-400">Permite incluir ou ocultar o documento no recibo.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleReceiptChange('mostrarCpf', !receiptConfig.mostrarCpf)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${receiptConfig.mostrarCpf ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${receiptConfig.mostrarCpf ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mensagem do Rodapé (Termos de Troca / Avisos)</label>
              <textarea rows={2} value={receiptConfig.mensagemRodape} onChange={(e) => handleReceiptChange('mensagemRodape', e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 resize-none" />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleSaveReceipt} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all">
                <Save className="h-4 w-4" /> Salvar Configurações
              </button>
              <button onClick={handlePrintTest} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all">
                <Printer className="h-4 w-4" /> Imprimir Teste
              </button>
              <button onClick={handleResetPattern} className="flex items-center justify-center p-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-all">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* REQUISITO R064: Seção 3 - Backup e Restauração de Dados */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-md font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Database className="h-5 w-5 text-blue-600" /> Configurações Avançadas: Backup e Segurança
            </h2>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Geração de Backup Manual Físico</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Extrai um dump estruturado do banco de dados compactado em um arquivo <span className="font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-1 rounded">.zip</span> contendo data e hora atuais. Guarde-o em local seguro (Ex: Pendrive).
                </p>
                {lastBackupTime && (
                  <p className="text-[10px] text-emerald-600 font-medium pt-1">
                    ✓ Último backup manual realizado nesta sessão: {new Date(lastBackupTime).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <button
                onClick={handleInitiateBackup}
                disabled={isGeneratingBackup}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
              >
                <Download className="h-4 w-4" /> Gerar Backup Agora
              </button>
            </div>

            {/* Barra de progresso visível durante extração (Critério 5) */}
            {isGeneratingBackup && (
              <div className="space-y-1.5 p-3 border border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20 rounded-xl">
                <div className="flex justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span className="flex items-center gap-1.5 animate-pulse">⚙️ Extraindo dump e estruturando tabelas...</span>
                  <span>{backupProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${backupProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA (Simulador) */}
        <div className="space-y-3 sticky top-24">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Visualizar Impressão ({receiptConfig.tamanhoPapel})
          </p>
          
          <div className="bg-[#fcfcf9] text-slate-800 border border-amber-100 shadow-md p-5 rounded-md font-mono text-[11px] leading-relaxed w-full max-w-sm mx-auto select-none">
            <div className="text-center space-y-1 mb-4 border-b border-dashed border-slate-300 pb-3">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-10 mx-auto object-contain mb-2 max-w-[120px]" />
              ) : (
                <div className="w-8 h-8 bg-slate-200 rounded-full mx-auto mb-1 flex items-center justify-center text-[9px] text-slate-400">[LOGO]</div>
              )}
              <h3 className="font-bold text-xs uppercase tracking-tight">{receiptConfig.nomeFantasia || 'SUA LOJA'}</h3>
              <p>CNPJ: {receiptConfig.cnpj || '00.000.000/0001-00'}</p>
              <p className="text-[10px]">{receiptConfig.endereco}</p>
              <p>TEL: {receiptConfig.telefone}</p>
            </div>

            <div className="space-y-1 border-b border-dashed border-slate-300 pb-2 mb-2">
              <p className="flex justify-between font-bold text-[10px]"><span>ITEM DETALHE</span> <span>QTD x VALOR</span></p>
              <p className="flex justify-between text-slate-600"><span>001 Camiseta Algodão M</span> <span>1x R$ 89,90</span></p>
              <p className="flex justify-between text-slate-600"><span>002 Calça Jeans Slim G</span> <span>1x R$ 149,00</span></p>
            </div>

            <div className="space-y-0.5 border-b border-dashed border-slate-300 pb-2 mb-3 text-right font-bold">
              <p className="flex justify-between"><span>SUBTOTAL:</span> <span>R$ 238,90</span></p>
              <p className="flex justify-between text-emerald-700"><span>TOTAL LIQUIDO:</span> <span>R$ 238,90</span></p>
              <p className="flex justify-between text-slate-600 font-normal text-[10px]"><span>FORMA PGTO:</span> <span>Cartão de Crédito</span></p>
            </div>

            <div className="text-center space-y-2 pt-1 text-[10px]">
              {receiptConfig.mostrarCpf && (
                <p className="text-slate-500 border border-dotted border-slate-300 py-0.5">CPF do Cliente: 123.456.789-00</p>
              )}
              
              <p className="italic text-slate-600 px-1">{receiptConfig.mensagemRodape || 'Obrigado pela visita!'}</p>
              
              <div className="flex items-center justify-center gap-3 text-[9px] font-bold border-t border-dashed border-slate-200 pt-2 text-slate-700">
                {receiptConfig.instagram && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {receiptConfig.instagram}</span>}
                {receiptConfig.whatsapp && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> {receiptConfig.whatsapp}</span>}
              </div>
              
              <div className="text-[8px] text-slate-400 pt-1">SGPV - Gerado em {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL DE SEGURANÇA: Solicitação de Senha do Administrador (Critério 4) */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Lock className="h-5 w-5" />
              <h3 className="font-bold text-sm">Confirmação de Identidade Requerida</h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Para segurança das informações e evitar vazamentos ou cópias não autorizadas por terceiros, digite sua senha administrativa para autorizar o download do dump.
            </p>

            <form onSubmit={handleConfirmPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Senha de Administrador</label>
                <input
                  type="password"
                  placeholder="Digite a senha (Dica: admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-blue-600"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Confirmar e Baixar
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); setAdminPassword(''); }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
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