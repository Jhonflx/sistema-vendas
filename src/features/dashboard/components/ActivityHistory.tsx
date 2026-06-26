'use client'

import { useState } from 'react'
import { ActivityHistoryItem } from '../type'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, PhoneCall, HelpCircle, UserPlus, Plus, MessageSquare } from 'lucide-react'

interface ActivityHistoryProps {
  activities: ActivityHistoryItem[]
  handleAddNote: (noteText: string) => void
}

export function ActivityHistory({ activities, handleAddNote }: ActivityHistoryProps) {
  const [noteText, setNoteText] = useState('')

  const onSubmitNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return
    handleAddNote(noteText)
    setNoteText('')
  }

  const getActivityIcon = (type: ActivityHistoryItem['tipo']) => {
    switch (type) {
      case 'compra':
        return <ShoppingCart className="h-4 w-4" />
      case 'contato':
        return <PhoneCall className="h-4 w-4" />
      case 'suporte':
        return <HelpCircle className="h-4 w-4" />
      case 'cadastro':
        return <UserPlus className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityHistoryItem['tipo']) => {
    switch (type) {
      case 'compra':
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'contato':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100'
      case 'suporte':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'cadastro':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna da Linha do Tempo de Atividades (Largura 2/3) */}
      <Card className="lg:col-span-2 border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Histórico de Atividades</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              {activities.length} Interações
            </span>
          </div>

          <div className="relative border-l border-slate-100 ml-4 space-y-6">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-8">
                {/* Indicador visual / Icone do tipo da atividade */}
                <div className={`absolute -left-4 top-1.5 flex h-8 w-8 items-center justify-center rounded-xl border shadow-sm ${getActivityColor(act.tipo)}`}>
                  {getActivityIcon(act.tipo)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{act.titulo}</h4>
                    <span className="text-xs text-slate-400 font-medium">{act.data}</span>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {act.descricao}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    {act.valor && (
                      <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-150 px-2 py-0.5 rounded font-semibold">
                        Valor: R$ {act.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                    {act.responsavel && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Registrado por: <strong className="text-slate-500 font-semibold">{act.responsavel}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coluna Lateral para adicionar nota de contato (Largura 1/3) */}
      <Card className="border-slate-100 shadow-sm h-fit">
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-md font-bold text-slate-800 tracking-tight">Nova Anotação de Contato</h3>
            <p className="text-xs text-slate-500 mt-1">
              Registre notas rápidas sobre reuniões, ligações ou solicitações deste cliente.
            </p>
          </div>

          <form onSubmit={onSubmitNote} className="space-y-3">
            <textarea
              className="w-full min-h-[120px] rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Digite aqui os detalhes do contato com o cliente..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9"
            >
              <Plus className="h-4 w-4" /> Registrar Nota
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
