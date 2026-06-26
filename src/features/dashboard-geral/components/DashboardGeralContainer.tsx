'use client'

import { useDashboardGeral } from '../hooks/useDashboardGeral'
import { MetricsGrid } from './MetricsGrid'
import { SalesChart } from './SalesChart'
import { RecentSalesTable } from './RecentSalesTable'
import { LayoutDashboard, RefreshCw } from 'lucide-react'

export function DashboardGeralContainer() {
  const { data, isLoading } = useDashboardGeral()

  if (isLoading || !data) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-md"></div>
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  <div className="h-6 w-28 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
              </div>
              <div className="h-4 w-32 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* Charts & Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 bg-white border border-slate-100 rounded-2xl p-6">
            <div className="h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-48 bg-slate-100 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-slate-100 rounded"></div>
              </div>
              <div className="h-48 w-full bg-slate-50 rounded-xl mt-6"></div>
              <div className="h-4 w-full bg-slate-100 rounded mt-6"></div>
            </div>
          </div>
          <div className="lg:col-span-5 h-96 bg-white border border-slate-100 rounded-2xl p-6">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2 pb-4 border-b border-slate-50">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
                <div className="h-3 w-40 bg-slate-100 rounded"></div>
              </div>
              <div className="flex-1 space-y-4 py-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            Dashboard Geral
          </h2>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Resumo comercial e histórico de transações do seu sistema.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-bold shadow-xs hover:border-slate-350 hover:bg-slate-50 transition-all cursor-pointer active:scale-97"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* 2. Grid de Métricas */}
      <MetricsGrid metrics={data.metrics} />

      {/* 3. Seção Visual: Gráfico & Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <SalesChart data={data.weeklySales} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <RecentSalesTable sales={data.recentSales} />
        </div>
      </div>
    </div>
  )
}
