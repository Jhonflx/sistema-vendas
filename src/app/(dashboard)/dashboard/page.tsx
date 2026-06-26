import type { Metadata } from 'next'
import { DashboardGeralContainer } from '@/features/dashboard-geral/components/DashboardGeralContainer'

export const metadata: Metadata = {
  title: 'Dashboard Geral | SGPV',
  description: 'Painel de controle de vendas com faturamento total, ticket médio e transações comerciais do sistema.',
}

export default function DashboardGeralPage() {
  return (
    <div className="space-y-6">
      {/* Elemento semântico H1 oculto para atender às diretrizes de SEO */}
      <h1 className="sr-only">Dashboard Geral de Vendas - SGPV</h1>
      
      <DashboardGeralContainer />
    </div>
  )
}
