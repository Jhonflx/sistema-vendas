'use client'

import { ClientProfile } from '../type'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, Building, User, Calendar, Edit3, Save, X, UserCheck, ShieldAlert } from 'lucide-react'

interface ProfileHeaderProps {
  profile: ClientProfile
  isEditing: boolean
  setIsEditing: (val: boolean) => void
  isSaving: boolean
  editProfile: ClientProfile
  setEditProfile: (val: any) => void
  handleSaveProfile: (e: React.FormEvent) => void
  handleUpdateStatus: () => void
}

export function ProfileHeader({
  profile,
  isEditing,
  setIsEditing,
  isSaving,
  editProfile,
  setEditProfile,
  handleSaveProfile,
  handleUpdateStatus,
}: ProfileHeaderProps) {
  return (
    <Card className="w-full bg-white border border-slate-100 shadow-sm p-6">
      <CardContent className="p-0 space-y-6">
        {/* Bloco de Avatar e Ações principais */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-x-5">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="relative h-20 w-20 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 shadow-xs">
              <User className="h-10 w-10" />
            </div>
            
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{profile.nome}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  profile.status === 'Ativo' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {profile.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {profile.segmento}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Building className="h-4 w-4 text-slate-400" />
                {profile.empresa}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdateStatus}
              className={`flex items-center gap-1.5 border-slate-200 ${
                profile.status === 'Ativo' 
                  ? 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200' 
                  : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
              }`}
            >
              {profile.status === 'Ativo' ? (
                <>
                  <ShieldAlert className="h-4 w-4" /> Desativar
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" /> Ativar
                </>
              )}
            </Button>
            
            {!isEditing && (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              >
                <Edit3 className="h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </div>
        </div>

        {/* Modo de Visualização vs Edição */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 border-t border-slate-100 pt-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-nome">Nome do Cliente</Label>
                <Input
                  id="edit-nome"
                  value={editProfile.nome}
                  onChange={(e) => setEditProfile({ ...editProfile, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-empresa">Empresa / Distribuidora</Label>
                <Input
                  id="edit-empresa"
                  value={editProfile.empresa}
                  onChange={(e) => setEditProfile({ ...editProfile, empresa: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-telefone">Telefone de Contato</Label>
                <Input
                  id="edit-telefone"
                  value={editProfile.telefone}
                  onChange={(e) => setEditProfile({ ...editProfile, telefone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditProfile({ ...profile })
                  setIsEditing(false)
                }}
                disabled={isSaving}
                className="flex items-center gap-1 border-slate-200"
              >
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Save className="h-4 w-4" /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">E-mail Corporativo</p>
                <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]" title={profile.email}>
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Telefone</p>
                <p className="text-sm font-medium text-slate-700">{profile.telefone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Cliente Desde</p>
                <p className="text-sm font-medium text-slate-700">{profile.dataCadastro}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Gerente de Contas</p>
                <p className="text-sm font-medium text-slate-700">{profile.responsavelComercial}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
