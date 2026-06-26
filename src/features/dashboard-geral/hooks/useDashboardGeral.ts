'use client'

import { useState, useEffect } from 'react'
import { DashboardGeralData } from '../type'

export function useDashboardGeral() {
  const [data, setData] = useState<DashboardGeralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API fetch delay
    const timer = setTimeout(() => {
      setData({
        metrics: [
          {
            id: 'faturamento',
            label: 'Faturamento Total',
            value: 'R$ 45.280,00',
            change: '+12,5%',
            changeType: 'positive',
            iconName: 'DollarSign',
            trendDescription: 'vs. mês passado',
          },
          {
            id: 'vendas_hoje',
            label: 'Vendas Hoje',
            value: '32',
            change: '+8,3%',
            changeType: 'positive',
            iconName: 'ShoppingCart',
            trendDescription: 'vs. ontem',
          },
          {
            id: 'ticket_medio',
            label: 'Ticket Médio',
            value: 'R$ 1.415,00',
            change: '-2,1%',
            changeType: 'negative',
            iconName: 'TrendingUp',
            trendDescription: 'vs. semana anterior',
          },
          {
            id: 'conversao',
            label: 'Taxa de Conversão',
            value: '4,8%',
            change: '+0,4%',
            changeType: 'positive',
            iconName: 'Percent',
            trendDescription: 'vs. média mensal',
          },
        ],
        weeklySales: [
          { day: 'Seg', amount: 5400, salesCount: 4 },
          { day: 'Ter', amount: 8200, salesCount: 6 },
          { day: 'Qua', amount: 6100, salesCount: 5 },
          { day: 'Qui', amount: 9800, salesCount: 7 },
          { day: 'Sex', amount: 12500, salesCount: 9 },
          { day: 'Sáb', amount: 4200, salesCount: 3 },
          { day: 'Dom', amount: 1900, salesCount: 1 },
        ],
        recentSales: [
          {
            id: 'sale-1',
            client: 'Ana Beatriz',
            date: '25/06/2026',
            status: 'Concluído',
            value: 1250.00,
          },
          {
            id: 'sale-2',
            client: 'Carlos Eduardo',
            date: '25/06/2026',
            status: 'Pendente',
            value: 450.00,
          },
          {
            id: 'sale-3',
            client: 'Mariana Souza',
            date: '24/06/2026',
            status: 'Concluído',
            value: 3200.00,
          },
          {
            id: 'sale-4',
            client: 'Roberto Santos',
            date: '24/06/2026',
            status: 'Concluído',
            value: 890.00,
          },
          {
            id: 'sale-5',
            client: 'Fernanda Lima',
            date: '23/06/2026',
            status: 'Pendente',
            value: 1500.00,
          },
        ],
      })
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  return {
    data,
    isLoading,
  }
}
