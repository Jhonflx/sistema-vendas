'use client'

import { RecentSale } from '../type'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'

interface RecentSalesTableProps {
  sales: RecentSale[]
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  // Format currency helpers
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <Card className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header da Tabela */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-50">
          <div>
            <h3 className="text-md font-semibold text-slate-800 tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-blue-600" />
              Últimas Vendas
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Transações recentes registradas no sistema
            </p>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-bold uppercase">
            Recente
          </span>
        </div>

        {/* Tabela Responsiva */}
        <div className="overflow-x-auto mt-4 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pt-1 font-bold">Cliente</th>
                <th className="pb-3 pt-1 font-bold">Data</th>
                <th className="pb-3 pt-1 font-bold">Status</th>
                <th className="pb-3 pt-1 font-bold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {sales.map((sale) => {
                const isCompleted = sale.status === 'Concluído'
                return (
                  <tr 
                    key={sale.id} 
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-[11px] border shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-blue-50/55 text-blue-600 border-blue-100/50 group-hover:bg-blue-600 group-hover:text-white'
                            : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-slate-600 group-hover:text-white'
                        }`}>
                          {getInitials(sale.client)}
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {sale.client}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400 font-medium text-xs">
                      {sale.date}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {formatBRL(sale.value)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
