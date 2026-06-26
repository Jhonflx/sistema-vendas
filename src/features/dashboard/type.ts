export interface ClientProfile {
  id: string
  nome: string
  email: string
  telefone: string
  status: 'Ativo' | 'Inativo'
  segmento: 'Premium' | 'Standard' | 'Enterprise'
  empresa: string
  avatarUrl?: string
  dataCadastro: string
  responsavelComercial: string
}

export interface EngagementSummary {
  totalComprado: number
  ticketMedio: number
  totalPedidos: number
  nivelEngajamento: 'Alto' | 'Médio' | 'Baixo'
  ultimoContato: string
}

export interface ActivityHistoryItem {
  id: string
  tipo: 'compra' | 'contato' | 'suporte' | 'cadastro'
  titulo: string
  descricao: string
  data: string
  valor?: number
  responsavel?: string
}

export interface DashboardData {
  profile: ClientProfile
  summary: EngagementSummary
  activities: ActivityHistoryItem[]
}
