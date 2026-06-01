'use client'

import Link from 'next/link'
import { useEsqueciSenha } from '../hooks/useEsqueciSenha'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Mail, ArrowLeft, KeyRound } from 'lucide-react'

export function FormEsqueciSenha() {
  const { register, handleSubmit, errors, isLoading } = useEsqueciSenha()

  return (
    <Card className="w-full max-w-md p-6 shadow-lg border-muted/40">
      <CardContent className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <KeyRound className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SGPV</h1>
          <p className="text-sm text-muted-foreground">Recuperação de Senha</p>
          <h2 className="text-md font-semibold text-slate-700 pt-2">Esqueceu sua senha?</h2>
          <p className="text-xs text-slate-500 max-w-[280px]">
            Digite seu e-mail cadastrado. Enviaremos um token de 6 dígitos para você redefinir sua senha.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail Corporativo</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                className="pl-10"
                disabled={isLoading}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Enviando token...' : 'Enviar Token de Verificação'}
          </Button>
        </form>

        {/* Link para voltar */}
        <div className="text-center pt-2">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Voltar para o Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}