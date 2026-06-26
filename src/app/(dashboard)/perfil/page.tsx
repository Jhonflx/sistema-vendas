import type { Metadata } from 'next'
import { DashboardContainer } from '@/features/dashboard/components/DashboardContainer'

export const metadata: Metadata = {
  title: 'Perfil do Cliente | SGPV',
  description: 'Visão geral do cliente, histórico de compras, interações comerciais e configurações de suporte.',
}

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      {/* Elemento semântico H1 oculto ou sutil para atender às diretrizes de SEO */}
      <h1 className="sr-only">Painel de Perfil do Cliente - SGPV</h1>
      
      <DashboardContainer />
    </div>
  )
}
