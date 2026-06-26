'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MetricItem } from '../type'
import { DollarSign, ShoppingCart, TrendingUp, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricsGridProps {
  metrics: MetricItem[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Percent,
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric) => {
        const IconComponent = iconMap[metric.iconName] || DollarSign
        const isPositive = metric.changeType === 'positive'
        
        return (
          <Card 
            key={metric.id} 
            className="group hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 tracking-wider uppercase">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-semibold text-slate-800 tracking-tight mt-1.5 group-hover:text-slate-900 transition-colors">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl transition-all duration-300 ${
                  metric.id === 'faturamento' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                  metric.id === 'vendas_hoje' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                  metric.id === 'ticket_medio' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' :
                  'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                }`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 mt-4">
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                  isPositive 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 shrink-0" />
                  )}
                  {metric.change}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {metric.trendDescription}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
