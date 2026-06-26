'use client'

import { useState } from 'react'
import { DashboardData, ActivityHistoryItem, ClientProfile } from '../type'
import { toast } from 'sonner'

const INITIAL_DASHBOARD_DATA: DashboardData = {
  profile: {
    id: 'cli-9482',
    nome: 'Maria Santos',
    email: 'maria.santos@parceiro.com.br',
    telefone: '(11) 98765-4321',
    status: 'Ativo',
    segmento: 'Premium',
    empresa: 'Santos Distribuidora Ltda',
    avatarUrl: '',
    dataCadastro: '12 de Outubro de 2024',
    responsavelComercial: 'Jhon Silva'
  },
  summary: {
    totalComprado: 12450.80,
    ticketMedio: 622.54,
    totalPedidos: 20,
    nivelEngajamento: 'Alto',
    ultimoContato: 'Hoje, às 14:32'
  },
  activities: [
    {
      id: 'act-1',
      tipo: 'compra',
      titulo: 'Compra realizada com sucesso',
      descricao: 'Pedido #90432 no valor de R$ 1.250,00 contendo 5x Licenças Pro.',
      data: 'Hoje, às 11:15',
      valor: 1250.00,
      responsavel: 'Faturamento Automático'
    },
    {
      id: 'act-2',
      tipo: 'contato',
      titulo: 'Reunião de Acompanhamento Mensal',
      descricao: 'Apresentação dos resultados de Q2 e alinhamento de metas para Q3.',
      data: 'Ontem, às 14:00',
      responsavel: 'Jhon Silva'
    },
    {
      id: 'act-3',
      tipo: 'suporte',
      titulo: 'Ticket de Suporte Resolvido',
      descricao: 'Dúvida técnica resolvida sobre a integração da API de notas fiscais.',
      data: '22 de Jun de 2026',
      responsavel: 'Suporte Nível 2'
    },
    {
      id: 'act-4',
      tipo: 'compra',
      titulo: 'Compra realizada com sucesso',
      descricao: 'Pedido #89823 no valor de R$ 890,00 de materiais corporativos.',
      data: '15 de Jun de 2026',
      valor: 890.00,
      responsavel: 'Faturamento Automático'
    },
    {
      id: 'act-5',
      tipo: 'cadastro',
      titulo: 'Integração de Cadastro Inicial',
      descricao: 'Conta homologada e configurada no segmento Premium pelo onboarding.',
      data: '12 de Out de 2024',
      responsavel: 'Onboarding System'
    }
  ]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(INITIAL_DASHBOARD_DATA)
  const [activeTab, setActiveTab] = useState<'geral' | 'atividades' | 'config'>('geral')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Estados para formulário de edição simples
  const [editProfile, setEditProfile] = useState<ClientProfile>({ ...INITIAL_DASHBOARD_DATA.profile })

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simula salvar no banco
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData(prev => ({
        ...prev,
        profile: { ...editProfile }
      }))
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNote = (noteText: string) => {
    if (!noteText.trim()) return

    const newActivity: ActivityHistoryItem = {
      id: `act-${Date.now()}`,
      tipo: 'contato',
      titulo: 'Anotação adicionada pelo usuário',
      descricao: noteText,
      data: 'Agora mesmo',
      responsavel: data.profile.responsavelComercial
    }

    setData(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities]
    }))

    toast.success('Anotação registrada com sucesso!')
  }

  const handleUpdateStatus = () => {
    const nextStatus = data.profile.status === 'Ativo' ? 'Inativo' : 'Ativo'
    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        status: nextStatus
      }
    }))
    setEditProfile(prev => ({
      ...prev,
      status: nextStatus
    }))
    toast.success(`Cliente alterado para ${nextStatus}!`)
  }

  return {
    profile: data.profile,
    summary: data.summary,
    activities: data.activities,
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    isSaving,
    editProfile,
    setEditProfile,
    handleSaveProfile,
    handleAddNote,
    handleUpdateStatus
  }
}
