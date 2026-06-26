'use client'

import { EngagementSummary } from '../type'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, TrendingUp, ShoppingBag, Zap } from 'lucide-react'

interface SummaryCardsProps {
  summary: EngagementSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  // Formata moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Gasto */}
      <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Comprado</p>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
              {formatCurrency(summary.totalComprado)}
            </h3>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center mt-1 gap-0.5">
              <span>+14.2%</span> no último mês
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Ticket Médio */}
      <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket Médio</p>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
              {formatCurrency(summary.ticketMedio)}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              Média calculada por pedido
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Qtd Pedidos */}
      <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Pedidos</p>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
              {summary.totalPedidos}
            </h3>
            <p className="text-[10px] text-indigo-600 font-medium mt-1">
              Todos faturados com sucesso
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Nível de Engajamento */}
      <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${
            summary.nivelEngajamento === 'Alto' 
              ? 'bg-emerald-50 text-emerald-600' 
              : summary.nivelEngajamento === 'Médio'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-rose-50 text-rose-600'
          }`}>
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Engajamento</p>
            <h3 className={`text-xl font-bold tracking-tight mt-0.5 ${
              summary.nivelEngajamento === 'Alto' 
                ? 'text-emerald-600' 
                : summary.nivelEngajamento === 'Médio'
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}>
              {summary.nivelEngajamento}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              Último contato: {summary.ultimoContato}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
