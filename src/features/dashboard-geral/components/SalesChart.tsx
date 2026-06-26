'use client'

import { DailySales } from '../type'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Calendar } from 'lucide-react'

interface SalesChartProps {
  data: DailySales[]
}

export function SalesChart({ data }: SalesChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1000)
  const totalWeekly = data.reduce((acc, curr) => acc + curr.amount, 0)

  // Format currency helpers
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full justify-between">
        {/* Header do Gráfico */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-50">
          <div>
            <h3 className="text-md font-semibold text-slate-800 tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              Evolução Semanal
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Faturamento por dia de venda
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Semanal</span>
            <p className="text-lg font-semibold text-blue-600 tracking-tight">{formatBRL(totalWeekly)}</p>
          </div>
        </div>

        {/* Visualizador do Gráfico */}
        <div className="relative mt-8 flex-1 flex flex-col justify-end">
          {/* Linhas de Grade de Fundo */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-medium">
            <div className="w-full border-t border-slate-100/70 pt-1 flex justify-between">
              <span>{formatBRL(maxAmount)}</span>
            </div>
            <div className="w-full border-t border-slate-100/70 pt-1 flex justify-between">
              <span>{formatBRL(maxAmount * 0.75)}</span>
            </div>
            <div className="w-full border-t border-slate-100/70 pt-1 flex justify-between">
              <span>{formatBRL(maxAmount * 0.5)}</span>
            </div>
            <div className="w-full border-t border-slate-100/70 pt-1 flex justify-between">
              <span>{formatBRL(maxAmount * 0.25)}</span>
            </div>
            <div className="w-full border-t border-slate-100/70 pt-1">
              <span>R$ 0</span>
            </div>
          </div>

          {/* Barras do Gráfico */}
          <div className="relative z-10 h-52 flex items-end justify-between px-2 sm:px-6 pt-4 gap-2 sm:gap-4">
            {data.map((item) => {
              const heightPercent = `${(item.amount / maxAmount) * 85}%` // cap height at 85% to not overflow lines
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip Hover */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg py-1.5 px-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 shadow-lg text-center z-20 whitespace-nowrap">
                    <p className="font-extrabold text-[11px] text-blue-300">{formatBRL(item.amount)}</p>
                    <p className="text-[9px] text-slate-300 font-semibold">{item.salesCount} {item.salesCount === 1 ? 'venda' : 'vendas'}</p>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>

                  {/* Barra Ativa */}
                  <div className="w-full bg-slate-50/50 rounded-t-xl h-full flex items-end justify-center">
                    <div
                      style={{ height: heightPercent }}
                      className="w-5/6 sm:w-2/3 bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 rounded-t-lg transition-all duration-500 ease-out shadow-xs group-hover:shadow-md cursor-pointer relative overflow-hidden"
                    >
                      {/* Reflexo de brilho interno para dar aspecto premium */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>

                  {/* Rótulo do Dia */}
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors mt-2">
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legenda e Data */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            Faturamento Diário
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-300" />
            Últimos 7 dias
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
