'use client'

import { useDashboard } from '../hooks/useDashboard'
import { ProfileHeader } from './ProfileHeader'
import { SummaryCards } from './SummaryCards'
import { ActivityHistory } from './ActivityHistory'
import { LayoutDashboard, History, Settings, FileText } from 'lucide-react'

export function DashboardContainer() {
  const {
    profile,
    summary,
    activities,
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    isSaving,
    editProfile,
    setEditProfile,
    handleSaveProfile,
    handleAddNote,
    handleUpdateStatus,
  } = useDashboard()

  return (
    <div className="space-y-6">
      {/* 1. Header do Perfil do Cliente */}
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isSaving={isSaving}
        editProfile={editProfile}
        setEditProfile={setEditProfile}
        handleSaveProfile={handleSaveProfile}
        handleUpdateStatus={handleUpdateStatus}
      />

      {/* 2. Navegação por Abas Customizadas */}
      <div className="border-b border-slate-100 flex items-center justify-between pb-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('geral')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'geral'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('atividades')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'atividades'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            Histórico & Notas
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </button>
        </div>
      </div>

      {/* 3. Conteúdo Dinâmico com base na aba ativa */}
      {activeTab === 'geral' && (
        <div className="space-y-6">
          {/* Métricas Resumidas */}
          <SummaryCards summary={summary} />

          {/* Histórico Recente (limitado aos 3 mais recentes no resumo) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-slate-800 tracking-tight">Atividades Recentes</h3>
              <button
                onClick={() => setActiveTab('atividades')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Ver histórico completo →
              </button>
            </div>
            <ActivityHistory
              activities={activities.slice(0, 3)}
              handleAddNote={handleAddNote}
            />
          </div>
        </div>
      )}

      {activeTab === 'atividades' && (
        <ActivityHistory
          activities={activities}
          handleAddNote={handleAddNote}
        />
      )}

      {activeTab === 'config' && (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Configurações da Conta</h3>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie as permissões e parâmetros operacionais do cliente Maria Santos.
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Alertas de Vencimento</p>
                <p className="text-xs text-slate-500">Enviar alertas de cobrança automaticamente por e-mail.</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-800">Relatórios Mensais</p>
                <p className="text-xs text-slate-500">Compilar e enviar relatórios de consumo e faturamento.</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-800">Segmento Exclusivo</p>
                <p className="text-xs text-slate-500">Tratamento prioritário no suporte e ofertas personalizadas.</p>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold uppercase">
                Premium
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
